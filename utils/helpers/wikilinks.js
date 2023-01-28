const {slugify} = require("../filters");
const chalk = require("chalk");

module.exports = function (md, {linkMapCache, eleventyConfig}) {
  const deadWikiLinks = new Set();

  eleventyConfig.on('eleventy.after', () => {
    deadWikiLinks.forEach(
      slug => console.warn(chalk.blue('[@photogabble/wikilinks]'), chalk.yellow('WARNING'), `WikiLink found pointing to non-existent [${slug}], has been set to default stub.`)
    );
  });

  // Recognize Mediawiki links ([[text]])
  md.linkify.add("[[", {
    validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
    normalize: match => {
      const parts = match.raw.slice(2, -2).split("|");
      const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());
      let found = linkMapCache.get(slug);

      if (!found) {
        deadWikiLinks.add(slug);
        match.text = parts.length === 2 ? parts[1] : parts[0];
        match.url = '/stubs';
        return;
      }

      match.text = parts.length === 2
        ? parts[1]
        : found.title;

      match.url = found.permalink.substring(0, 1) === '/'
        ? found.permalink
        : `/${found.permalink}`;
    }
  })
};