const filters = require('./utils/filters')
const collections = require('./utils/collections')
const {slugify} = require('./utils/filters')
const shortcodes = require('./utils/shortcodes');
const transforms = require('./utils/transforms');
const wordStats = require('@photogabble/eleventy-plugin-word-stats');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const PostCSSPlugin = require("eleventy-plugin-postcss");
const linkMapCache = require("./utils/helpers/map");

const UpgradeHelper = require("@11ty/eleventy-upgrade-help");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(UpgradeHelper);
  eleventyConfig.addPlugin(PostCSSPlugin);

  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPlugin(wordStats, {
    output: (stats) => {
      return {
        words: stats.words,
        time: stats.text,
        text: `${stats.words} words, ${stats.text}`
      };
    }
  });
  eleventyConfig.addPlugin(pluginRss);

  /**
   * Filters
   * @link https://www.11ty.io/docs/filters/
   */
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName])
  })

  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  })

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy({
    './_assets/favicon': './',
    './_assets/files': './files',
    './img': './img',
    '_redirects': '_redirects'
  });

  for (const shortCode in shortcodes) {
    eleventyConfig.addShortcode(shortCode, shortcodes[shortCode]);
    console.log(shortCode);
  }

  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

  eleventyConfig.addPlugin(syntaxHighlight, {
    init: ({ Prism }) => {
      require('prismjs/plugins/treeview/prism-treeview.js')
      require('prismjs/components/prism-clike')
      require('prismjs/components/prism-markup')
      require('prismjs/components/prism-markup-templating')
      require('prismjs/components/prism-ini')
      require('prismjs/components/prism-css')
      require('prismjs/components/prism-bash')
      require('prismjs/components/prism-powershell')
      require('prismjs/components/prism-yaml')
      require('prismjs/components/prism-javascript')
      require('prismjs/components/prism-sql')
      require('prismjs/components/prism-twig')
      require('prismjs/components/prism-php')
      require('prismjs/components/prism-php-extras')
      require('prismjs/components/prism-markdown')
      require('prismjs/components/prism-basic')
      require('prismjs/components/prism-go')
    }
  });

  // Markdown libraries
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let markdownFootnote = require("markdown-it-footnote");

  eleventyConfig.on('eleventy.after', async () => {
    const all = linkMapCache.all();
    const n = 1;
  });

  eleventyConfig
    .setLibrary("md", markdownIt({
      html: true,
      breaks: true,
      linkify: true
    }).use(markdownItAnchor, {
      permalink: false,
      slugify: input => slugify(input)
    }).use(markdownFootnote).use(function(md) {
      // Recognize Mediawiki links ([[text]])
      md.linkify.add("[[", {
        validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
        normalize: match => {
          const parts = match.raw.slice(2, -2).split("|");
          const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());
          const found = linkMapCache.get(slug);

          if (!found) {
            throw new Error(`Unable to find page linked by wikilink slug [${slug}]`)
          }

          match.text = parts.length === 2
            ? parts[1]
            : found.title;

          match.url = found.permalink.substring(0,1) === '/'
            ? found.permalink
            : `/${found.permalink}`;
        }
      })
    }));
};
