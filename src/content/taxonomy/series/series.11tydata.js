/**
 * Series and Volumes
 *
 * This folder contains landing pages for long-running series, the idea here is
 * to group serial content such as tutorials under an index page. I also
 * want to make use of this for the Week In Review, in which case the different
 * years will be different _volumes_ of the same series.
 *
 */
export default {
  // Do not include in RSS Feed
  excludeFromFeed: true,

  // Tagged as special topic type, these aren't regular pages
  tags: ['type/series'],

  // Do not display page meta data
  hide_meta: true,
  folder: ['series'],

  // TODO: complete eleventy computed data to be volume aware?
  eleventyComputed: {
    permalink(data) {
      return `series/${data.page.fileSlug}/`;
    },
  },
}
