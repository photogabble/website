/**
 * Code borrowed from:
 * @see https://git.sr.ht/~boehs/site/tree/master/item/html/pages/garden/garden.11tydata.js
 */
const slugify = require("./strToSlug");
const linkMapCache = require("./map");

// This regex finds all wikilinks in a string
const wikilinkRegExp = /(?<!!)\[\[([^|]+?)(\|([\s\S]+?))?\]\]/g;

const parseWikilinks = (arr) => arr.map(link => {
  const parts = link.slice(2, -2).split("|");
  const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());

  return {
    title: parts.length === 2 ? parts[1] : null,
    link,
    slug
  }
});

// This function gets past each page via content.11tydata.js in order to fill that pages backlinks data array.
module.exports = (data) => {
  if (!data.collections.all || data.collections.all.length === 0) return [];
  const allPages = data.collections.all;
  const currentSlug = slugify(data.title);
  let backlinks = [];
  let currentSlugs = [currentSlug];

  // Populate our link map for use later in replacing wikilinks with page permalinks.
  // Pages can list aliases in their front matter, if those exist we should map them
  // as well.

  linkMapCache.add(currentSlug, {
    permalink: data.permalink,
    title: data.title
  });

  if (data.aliases) {
    for(const alias of data.aliases) {
      const aliasSlug = slugify(alias);
      linkMapCache.add(aliasSlug, {
        permalink: data.permalink,
        title: alias
      });
      currentSlugs.push(aliasSlug)
    }
  }

  // Loop over all pages and build their outbound links if they have not already been
  // parsed, this is being done in a way that is cached between reloads so restarting
  // the dev server will be required to pick up changes.
  allPages.forEach(page => {
    if (!page.data.outboundLinks) {
      const pageContent = page.template.frontMatter.content;
      const outboundLinks = (pageContent.match(wikilinkRegExp) || []);

      page.data.outboundLinks = parseWikilinks(outboundLinks);
    }

    // If the page links to our current page either by its title or by its aliases then
    // add that page to our current page's backlinks.
    if (page.data.outboundLinks.some(link => currentSlugs.includes(link.slug))) {
      backlinks.push({
        url: page.url,
        title: page.data.title,
      })
    }
  });

  // The backlinks for the current page, set to the page data by content.11tydata.js
  return backlinks;
}