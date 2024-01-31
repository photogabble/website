const filters = require('./lib/filters');
const asyncFilters = require('./lib/async-filters');
const collections = require('./lib/collections');
const {slugify} = require('./lib/filters');
const shortcodes = require('./lib/shortcodes');
const transforms = require('./lib/transforms');
const ObjectCache = require("./lib/helpers/cache");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  //
  // Install Plugins
  //

  eleventyConfig.addPlugin(require('@rknightuk/eleventy-plugin-post-graph'), {
    boxColor: 'var(--background-muted)',
    highlightColor: 'var(--accent)',
    textColor: 'var(--foreground)',
  });

  eleventyConfig.addPlugin(require('./lib/helpers/screenshot'));

  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-interlinker'), {
    defaultLayout: 'layouts/embed.liquid',
  });

  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-font-subsetting'), {
    srcFiles: [
      `./public/fonts/iosevka-etoile-regular.woff2`,
      `./public/fonts/iosevka-etoile-italic.woff2`,
      `./public/fonts/iosevka-etoile-bold.woff2`,
      `./public/fonts/iosevka-etoile-bolditalic.woff2`,
    ],
    dist: './src/fonts',
    enabled: process.env.ELEVENTY_ENV !== 'production',
    cache: new ObjectCache('font-subsetting'),
  });

  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-tag-normaliser'), {
    ignore: ['PHP', 'JavaScript', 'DOScember'],
    similar: {
      'Game Development': ['GameDev'],
      'Retro Computing': ['RetroComputing'],
      'Node JS': ['Node'],
      '365 Day Project': ['365DayProject']
    },
    slugify,
  });

  eleventyConfig.addPlugin(require("eleventy-plugin-postcss"));

  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-blogtimes'), {
    generateHTML: (outputUrl, options) => `<img alt="Blogtimes histogram" width="${options.width}" height="${options.height}" src="${outputUrl}" style="min-width: auto;" />`,
    lastXDays: 180,
  });

  const numberFormat = new Intl.NumberFormat('en-GB');

  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-word-stats'), {
    output: (stats) => {
      const words = numberFormat.format(stats.words);
      return {
        words: stats.words,
        time: stats.text,
        text: `~${words} words, about a ${stats.text}`
      };
    }
  });

  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));

  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"), {
    init: ({Prism}) => {
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

  //
  // Filters, Collections, Transformers and Shortcodes
  //

  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  });

  Object.keys(asyncFilters).forEach((filterName) => {
    eleventyConfig.addAsyncFilter(filterName, asyncFilters[filterName]);
  });

  for (const [name, collection] of Object.entries(collections(eleventyConfig))) {
    eleventyConfig.addCollection(name, collection);
  }

  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  });

  Object.keys(shortcodes).forEach((shortCodeName) => {
    eleventyConfig.addShortcode(shortCodeName, shortcodes[shortCodeName]);
  });

  //
  // Pass through
  //

  eleventyConfig.addPassthroughCopy({
    'public/favicon': '/',
    'public/files': 'files',
    'public/img': 'img',
    'public/sounds': 'sounds',
    '_redirects': '_redirects',
    'public/og-image': 'img/og-image',
    'public/main.js': 'main.js',
  });

  //
  // Markdown-It && Plugins
  //

  eleventyConfig.setLibrary('md', require('./lib/helpers/markdown'));

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };

};
