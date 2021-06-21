const filters = require('./utils/filters')
const collections = require('./utils/collections')
const {slugify} = require('./utils/filters')

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

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

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy({
    "./_tmp/style.css": "./style.css",
    "./_tmp/assets": "./assets",
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
    './assets': './assets'
  });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now())
  });

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
  let markdownFootnote = require("markdown-it-footnote")

  eleventyConfig
    .setLibrary("md", markdownIt({
      html: true,
      breaks: true,
      linkify: true
    }).use(markdownItAnchor, {
      permalink: false,
      slugify: input => slugify(input)
    }).use(markdownFootnote));
};
