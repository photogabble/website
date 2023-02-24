const { EleventyRenderPlugin } = require("@11ty/eleventy");
const slugify = require("../helpers/strToSlug");
const chalk = require("chalk");

/**
 * Some code borrowed from:
 * @see https://git.sr.ht/~boehs/site/tree/master/item/html/pages/garden/garden.11tydata.js
 *
 * @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig
 * @param {*} options
 */
module.exports = function (eleventyConfig, options = {}) {
  const rm = new EleventyRenderPlugin.RenderManager();

  // This regex finds all WikiLink style links: [[id|optional text]] as well as WikiLink style embeds: ![[id]]
  const wikilinkRegExp = /(?<!!)(!?)\[\[([^|]+?)(\|([\s\S]+?))?\]\]/g;

  const parseWikiLink = (link) => {
    const isEmbed = link.startsWith('!');
    const parts = link.slice((isEmbed ? 3 : 2), -2).split("|").map(part => part.trim());
    const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());

    return {
      title: parts.length === 2 ? parts[1] : null,
      name: parts[0],
      link,
      slug,
      isEmbed
    }
  };

  const parseWikiLinks = (arr) => arr.map(link => parseWikiLink(link));

  const compileTemplate = async (data) => {
    if (compiledEmbeds.has(data.inputPath)) return;

    const frontMatter = data.template.frontMatter;
    const fn = await rm.compile(frontMatter.content, data.page.templateSyntax, {templateConfig, extensionMap});
    const result = await fn(frontMatter.data);

    compiledEmbeds.set(data.inputPath, result);
  }

  // Set of WikiLinks pointing to non-existent pages
  const deadWikiLinks = new Set();

  // Map of what WikiLinks to what
  const linkMapCache = new Map();

  // Map of WikiLinks that have triggered an embed compile
  const compiledEmbeds = new Map();

  let templateConfig;
  eleventyConfig.on("eleventy.config", (cfg) => {
    templateConfig = cfg;
  });

  let extensionMap;
  eleventyConfig.on("eleventy.extensionmap", (map) => {
    extensionMap = map;
  });

  eleventyConfig.on('eleventy.before', () => {
    // TODO: reset deadWikiLinks and linkMapCache between runs (useful if using dev server)
  });

  eleventyConfig.on('eleventy.after', () => {
    deadWikiLinks.forEach(
      slug => console.warn(chalk.blue('[@photogabble/wikilinks]'), chalk.yellow('WARNING'), `WikiLink found pointing to non-existent [${slug}], has been set to default stub.`)
    );
  });

  // Teach Markdown-It how to display MediaWiki Links.
  eleventyConfig.amendLibrary('md', (md) => {
    // WikiLink Embed
    md.inline.ruler.push('inline_wikilink_embed', (state, silent) => {
      // Have we found the start of a WikiLink Embed `![[`
      if (state.src.charAt(state.pos) === '!' && state.src.substring(state.pos, state.pos + 3) === '![[') {
        const wikiLink = parseWikiLink(state.src);
        if (!silent) {
          const token = state.push('inline_wikilink_embed', '', 0)
          const wikiLink = parseWikiLink(state.src);
          token.content = wikiLink.slug;
          state.pos = state.posMax;
        }
        return true;
      }
    });

    md.renderer.rules.inline_wikilink_embed = (tokens, idx) => {
      const token = tokens[idx];
      const link = linkMapCache.get(token.content);
      if (!link) {
        console.error(chalk.blue('[@photogabble/wikilinks]'), chalk.red('ERROR'), `WikiLink Embed found pointing to non-existent [${token.content}], doesn't exist.`);
        return '[UNABLE TO LOCATE EMBED]';
      }

      const templateContent = compiledEmbeds.get(link.page.inputPath);
      if (!templateContent) {
        console.error(chalk.blue('[@photogabble/wikilinks]'), chalk.red('ERROR'), `WikiLink Embed found pointing to [${token.content}], has no compiled template.`);
        return '[UNABLE TO COMPILE EMBED]';
      }

      return templateContent;
    }

    // WikiLink via linkify
    md.linkify.add("[[", {
      validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
      normalize: match => {
        const wikiLink = parseWikiLink(match.raw);
        const found = linkMapCache.get(wikiLink.slug);

        if (!found) {
          deadWikiLinks.add(wikiLink.slug);
          match.text = wikiLink.title ?? wikiLink.name;
          match.url = '/stubs';
          return;
        }

        match.text = wikiLink.title ?? found.title;
        match.url = found.page.url;
      }
    });
  });

  // Add backlinks computed global data, this is executed before the templates are compiled and thus markdown parsed.
  eleventyConfig.addGlobalData('eleventyComputed', {
    backlinks: async (data) => {
      // @see https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
      const dependencies = [data.title, data.page, data.collections.all];
      if (dependencies[0] === undefined || !dependencies[1].fileSlug || dependencies[2].length === 0) return [];

      const compilePromises = [];
      const allPages = data.collections.all;
      const currentSlug = slugify(data.title);
      let backlinks = [];
      let currentSlugs = [currentSlug];

      // Populate our link map for use later in replacing WikiLinks with page permalinks.
      // Pages can list aliases in their front matter, if those exist we should map them
      // as well.

      linkMapCache.set(currentSlug, {
        page: data.collections.all.find(page => page.inputPath === data.page.inputPath),
        title: data.title
      });

      if (data.aliases) {
        for (const alias of data.aliases) {
          const aliasSlug = slugify(alias);
          linkMapCache.set(aliasSlug, {
            page: data.collections.all.find(page => page.inputPath === data.page.inputPath),
            title: alias
          });
          currentSlugs.push(aliasSlug)
        }
      }

      // Loop over all pages and build their outbound links if they have not already been parsed.
      allPages.forEach(page => {
        if (!page.data.outboundLinks) {
          const pageContent = page.template.frontMatter.content;
          const outboundLinks = (pageContent.match(wikilinkRegExp) || []);
          page.data.outboundLinks = parseWikiLinks(outboundLinks);
          page.data.outboundLinks
            .filter(link => link.isEmbed && compiledEmbeds.has(link.slug) === false)
            .map(link => data.collections.all.find(page => page.fileSlug === link.slug)) // TODO: add OR aliases contains? add OR permalink equals
            .forEach(link => {
              if (!link) return; // TODO: Warn developer
              compilePromises.push(
                compileTemplate(link)
              );
            })
        }

        // If the page links to our current page either by its title or by its aliases then
        // add that page to our current page's backlinks.
        if (page.data.outboundLinks.some(link => currentSlugs.includes(link.slug))) {
          backlinks.push({
            url: page.url,
            title: page.data.title,
          })
        }
      });

      // Block iteration until compilation complete.
      if (compilePromises.length > 0) await Promise.all(compilePromises);

      // The backlinks for the current page.
      return backlinks;
    }
  });
};