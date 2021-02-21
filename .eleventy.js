module.exports = function (eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);
    eleventyConfig.addWatchTarget("./_tmp/style.css");
    eleventyConfig.addPassthroughCopy({
        "./_tmp/style.css": "./style.css",
        "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
        "./images" : './images'
    });
    eleventyConfig.addShortcode("version", function () {
        return String(Date.now());
    });
};