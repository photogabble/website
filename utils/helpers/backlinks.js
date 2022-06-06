/**
 * Code borrowed from:
 * @see https://git.sr.ht/~boehs/site/tree/master/item/html/pages/garden/garden.11tydata.js
 */
const slugify = require("./strToSlug");
// This regex finds all wikilinks in a string
const wikilinkRegExp = /(?<!!)\[\[([^|]+?)(\|([\s\S]+?))?\]\]/g;

module.exports = (data) => {
  if (!data.collections.all || data.collections.all.length === 0) return [];
  const pages = data.collections.all;
  const currentSlug = slugify(data.title);
  let backlinks = [];

  // Identify where pages are linking to and add to this pages backlinks if linking...
  pages.forEach(page => {
    if (!page.data.outboundLinks) {
      const pageContent = page.template.frontMatter.content;
      const outboundLinks = (pageContent.match(wikilinkRegExp) || []);

      page.data.outboundLinks = outboundLinks.map(link => slugify(link)
        .slice(2, -2)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .trim());
      const n = 1;
    }

    if (page.data.outboundLinks.some(link => link === currentSlug)) {
      const pageContent = page.template.frontMatter.content;
      const outboundLinks = (pageContent.match(wikilinkRegExp) || []);

      // Replace wikilink linking here with <a> link
      outboundLinks.forEach(link => {
        // TODO: Only replace links that point to this page...
        page.template.frontMatter.content = page.template.frontMatter.content.replace(
          link,
          `<a href="/${data.permalink}">${data.title}</a>`
        );
      });

      backlinks.push({
        url: page.url,
        title: page.data.title,
      })
    }
  });

  if (backlinks.length > 0) {
    const n = 1;
  }

  return backlinks;
}