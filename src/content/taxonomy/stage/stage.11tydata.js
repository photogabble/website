/**
 * Content Stages
 *
 */
export default {
  // Do not include in RSS Feed
  excludeFromFeed: true,

  // Tagged as special topic type, these aren't regular pages
  tags: ['type/stage'],

  // Do not display page meta data
  hide_meta: true,
  folder: ['series'],

  sidebar_component: 'topic',

  eleventyComputed: {
    permalink(data) {
      return (data.permalink === '')
        ? `/growth/${data.page.fileSlug}/`
        : data.permalink;
    },
  },
}
