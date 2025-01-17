import interlinker from '@photogabble/eleventy-plugin-interlinker';
import wordstats from '@photogabble/eleventy-plugin-word-stats';
import blogtimes from '@photogabble/eleventy-plugin-blogtimes';
import screenshot from './lib/helpers/screenshot.js';
import rss from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import postGraph from '@rknightuk/eleventy-plugin-post-graph';
import postcss from '@jgarber/eleventy-plugin-postcss';
import hashtags from './lib/helpers/hashtags.js';
import markdown from './lib/helpers/markdown.js';
import {registerShortcodes} from "./lib/shortcodes.js";
import {registerFilters} from "./lib/filters.js";
import {registerCollections} from "./lib/collections.js";
import * as Eleventy from '@11ty/eleventy';
import ToCPlugin from '@uncenter/eleventy-plugin-toc';
const {EleventyRenderPlugin} = Eleventy;


export default async function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  //
  // Install Plugins
  //

  /**
   * Table of Contents Plugin
   * @see https://github.com/uncenter/eleventy-plugin-toc
   */
  eleventyConfig.addPlugin(ToCPlugin, {
    ignoredElements: ['a']
  });

  /**
   * 11ty Render Plugin
   * @see https://www.11ty.dev/docs/plugins/render/
   */
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  /**
   * @rknightuk/eleventy-plugin-post-graph
   * @see https://www.npmjs.com/package/@rknightuk/eleventy-plugin-post-graph
   */
  eleventyConfig.addPlugin(postGraph, {
    boxColor: 'var(--darker-color)',
    highlightColor: 'var(--key-color)',
    textColor: 'var(--light-color)',
  });

  // TODO: REL2024, should this be its own external plugin? Are there alternatives to use?
  // TODO: Disabled until fixed as part of REL2024
  eleventyConfig.addPlugin(screenshot);

  /**
   * @todo disabled until build working for REL2024
   * @photogabble/eleventy-plugin-interlinker
   * @see https://www.npmjs.com/package/@photogabble/eleventy-plugin-interlinker
   */
  eleventyConfig.addPlugin(interlinker, {
    defaultLayout: 'layouts/embed.liquid',
  });

  /**
   * Plugin normalises hashtags being converted into page tags.
   * @photogabble/eleventy-plugin-tag-normaliser
   * @see https://www.npmjs.com/package/@photogabble/eleventy-plugin-tag-normaliser
   */
  eleventyConfig.addPlugin(hashtags, {
    ignore: ['PHP', 'JavaScript', 'DOScember'],
    similar: {
      'Old Web': ['OldWeb'],
      'Game Development': ['GameDev'],
      'Retro Computing': ['RetroComputing'],
      'Node JS': ['Node'],
      '365 Day Project': ['365DayProject']
    },
  });

  /**
   * Plugin registers PostCSS as a renderer for .css files.
   * @jgarber/eleventy-plugin-postcss
   * @see https://www.npmjs.com/package/@jgarber/eleventy-plugin-postcss
   */
  eleventyConfig.addPlugin(postcss);

  /**
   * @photogabble/eleventy-plugin-blogtimes
   * @see https://www.npmjs.com/package/@photogabble/eleventy-plugin-blogtimes
   */
  eleventyConfig.addPlugin(blogtimes, {
    generateHTML: (outputUrl, options) => `<img alt="Blogtimes histogram" width="${options.width}" height="${options.height}" src="${outputUrl}" style="min-width: auto;" />`,
    lastXDays: 180,
  });

  /**
   * @photogabble/eleventy-plugin-word-stats
   * @see https://www.npmjs.com/package/@photogabble/eleventy-plugin-word-stats
   */
  const numberFormat = new Intl.NumberFormat('en-GB');

  eleventyConfig.addPlugin(wordstats, {
    output: (stats) => {
      const words = numberFormat.format(stats.words);
      return {
        words: stats.words,
        time: stats.text,
        text: `~${words} words, about a ${stats.text}`
      };
    }
  });

  /**
   * @11ty/eleventy-plugin-rss
   * Provides helper functions for creating RSS Feeds
   * @see https://www.11ty.dev/docs/plugins/rss/
   */
  eleventyConfig.addPlugin(rss);

  /**
   * @11ty/eleventy-plugin-syntaxhighlight
   * Provides build time transformation of code blocks using PrismJS syntax highlighting
   * @todo check highlighting of tree and other special languages I had set before still works
   * @see https://www.11ty.dev/docs/plugins/syntaxhighlight/
   */
  eleventyConfig.addPlugin(syntaxHighlight.configFunction, {
    preAttributes: { tabindex: 0 }
  });

  //
  // Filters, Collections, Transformers and Shortcodes
  //

  registerShortcodes(eleventyConfig);
  registerFilters(eleventyConfig);
  registerCollections(eleventyConfig);

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

  eleventyConfig.setLibrary('md', markdown());

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
    ],

    markdownTemplateEngine: "liquid",

    htmlTemplateEngine: "liquid",

    dir: {
      input: "src",
      output: "_site"
    }
  };
};
