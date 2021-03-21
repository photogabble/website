module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);

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

    // Filter posts marked as being draft if this is running in production
    eleventyConfig.addCollection('post', (collection) => {
        if (process.env.ELEVENTY_ENV !== 'production')
            return [...collection.getFilteredByGlob('./src/posts/*.md')]
        else
            return [...collection.getFilteredByGlob('./src/posts/*.md')].filter((post) => !post.data.draft)
    })

    eleventyConfig.addShortcode("version", function () {
        return String(Date.now())
    });

    const slugify = require("slugify");
    const slugifyOptions = {
        replacement: "-",
        remove: /[&,+()$~%.'":*?<>{}]/g,
        lower: true
    };

    eleventyConfig.addFilter('slugify', input => slugify(input, slugifyOptions));

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
            slugify: input => slugify(input, slugifyOptions)
        })
        .use(markdownFootnote)
    );
};