const filters = require('./utils/filters')
const collections = require('./utils/collections')
const { slugify } = require('./utils/filters')

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
        "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
        "./images" : './images'
    });

    eleventyConfig.addShortcode("version", function () {
        return String(Date.now())
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
        })
        .use(markdownItAnchor, {
            permalink: false,
            slugify: input => slugify(input)
        })
        .use(markdownFootnote)
    );
};