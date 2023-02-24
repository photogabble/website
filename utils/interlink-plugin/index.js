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
  // This regex finds all Wikilink style links: [[id|optional text]] as well as wikilink style embeds: ![[id]]
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

  // Set of WikiLinks pointing to non-existent pages
  const deadWikiLinks = new Set();

  // Map of what links to what
  const linkMapCache = new Map();

  eleventyConfig.on('eleventy.after', () => {
    deadWikiLinks.forEach(
      slug => console.warn(chalk.blue('[@photogabble/wikilinks]'), chalk.yellow('WARNING'), `WikiLink found pointing to non-existent [${slug}], has been set to default stub.`)
    );
  });

  // Teach Markdown-It how to display MediaWiki Links
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
      const found = linkMapCache.get(token.content);
      if (!found) {
        console.error(chalk.blue('[@photogabble/wikilinks]'), chalk.red('ERROR'), `WikiLink Embed found pointing to non-existent [${token.content}], doesn't exist.`)
        return '[UNABLE TO LOCATE EMBED]';
      }

      // TODO: find source file for embed and either process it directly with liquid using an embed template OR work out how to do so through 11ty. It may be a good idea to use the
      //       extract feature already supported within 11ty, that way I can actually tag what should be embedded.

      return `<aside><p>Hello world</p></aside>`;
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

  // Add backlinks computed global data
  eleventyConfig.addGlobalData('eleventyComputed', {
    backlinks: (data) => {
      // @see https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
      const dependencies = [data.title, data.page, data.collections.all];
      if (dependencies[0] === undefined || !dependencies[1].fileSlug || dependencies[2].length === 0) return [];

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

      // Loop over all pages and build their outbound links if they have not already been
      // parsed, this is being done in a way that is cached between reloads so restarting
      // the dev server will be required to pick up changes.
      allPages.forEach(page => {
        if (!page.data.outboundLinks) {
          const pageContent = page.template.frontMatter.content;
          const outboundLinks = (pageContent.match(wikilinkRegExp) || []);
          page.data.outboundLinks = parseWikiLinks(outboundLinks);
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

      // The backlinks for the current page.
      return backlinks;
    }
  });
};