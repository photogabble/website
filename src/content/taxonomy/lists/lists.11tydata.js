/**
 * Files within this folder describe my lists and collections. This replaces the legacy lists-meta.js data file.
 * The file slug becomes the list's identifier e.g test.md will reference all posts tagged as `list/test`. This
 * allows writing custom copy for each list as well as easily deciding which layout to use.
 */

export default {
  // Do not include in RSS Feed
  excludeFromFeed: true,
  // Tagged as special topic type, these aren't regular pages
  tags: ['type/list'],
  // Do not display page meta data
  hide_meta: true,
  folder: ['lists'],

  sidebar_component: 'lists',

  // This is used by the lists sidebar component to group lists.
  // Current valid values are: media or collection.
  list_category: 'collection',

  // Most lists use the list page layout
  layout: 'layouts/page-list.njk',

  eleventyComputed: {
    permalink(data) {
      return (data.permalink === '')
        ? `/lists/${data.page.fileSlug}/`
        : data.permalink;
    },
    items(data) {
      if (!data.collections.lists) return [];
      const slug = data.list_slug ?? data.page.fileSlug;
      const list = data.collections.lists.find(list => list.slug === slug);
      return list?.items ?? [];
    },
  },
}
