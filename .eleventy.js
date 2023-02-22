const filters = require('./utils/filters')
const collections = require('./utils/collections');
const {slugify} = require('./utils/filters');
const shortcodes = require('./utils/shortcodes');
const transforms = require('./utils/transforms');
const wordStats = require('@photogabble/eleventy-plugin-word-stats');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const PostCSSPlugin = require("eleventy-plugin-postcss");
const linkMapCache = require("./utils/helpers/map");
const {setupMarkdownIt} = require("./utils/helpers/hashtags");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addPlugin(require('./utils/font-plugin'), {
    srcFiles: [
      `./_assets/fonts/iosevka-etoile-regular.woff2`,
      `./_assets/fonts/iosevka-etoile-italic.woff2`,
      `./_assets/fonts/iosevka-etoile-bold.woff2`,
      `./_assets/fonts/iosevka-etoile-bolditalic.woff2`,
    ],
    dist: './fonts',
    enabled: process.env.ELEVENTY_ENV !== 'production'
  });
  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-tag-normaliser'), {
    ignore: ['PHP', 'JavaScript', 'DOScember'],
    similar: {
      'Game Development': ['GameDev'],
    },
    slugify,
  });
  eleventyConfig.addPlugin(PostCSSPlugin);
  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-blogtimes'), {
    generateHTML: (outputUrl, options) => `<img alt="Blogtimes histogram" width="${options.width}" height="${options.height}" src="${outputUrl}" style="min-width: auto;" />`,
    lastXDays: 180,
  });
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

  for (const [name, collection] of Object.entries(collections(eleventyConfig))) {
    eleventyConfig.addCollection(name, collection);
  }

  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  })

  for (const [name, shortCode] of Object.entries(shortcodes(eleventyConfig))) {
    eleventyConfig.addShortcode(name, shortCode);
  }

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy({
    '_assets/favicon': '/',
    '_assets/files': 'files',
    'img': './img',
    '_redirects': '_redirects',
    '_assets/og-image': 'img/og-image',
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
      require('prismjs/components/prism-regex')
    }
  });

  // Markdown libraries
  const markdownIt = require('markdown-it')({
    html: true,
    breaks: true,
    linkify: true,
  }).use(require("markdown-it-anchor"), {
    permalink: false,
    slugify: input => slugify(input),
  }).use(require('./utils/helpers/wikilinks'),{
    linkMapCache,
    eleventyConfig
  }).use(require("markdown-it-footnote"));

  setupMarkdownIt(markdownIt);

  // eleventyConfig.on('eleventy.after', async () => {
  //   const all = linkMapCache.all();
  //   const n = 1;
  // });

  eleventyConfig.setLibrary("md", markdownIt);
};
