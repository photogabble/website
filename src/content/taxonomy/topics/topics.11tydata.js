/**
 * Files within this folder become the details page for a given topic (tag).
 * This is useful when you want to give some description or story behind why
 * a certain topic exists, such as with #blogging and #oldWeb where I have
 * an extensive personal history that I would like to share.
 */
export default {
  // Do not show related notes
  show_related: false,
  // Do not show prev/next links
  show_prev_next: false,
  // Do not include in RSS Feed
  excludeFromFeed: true,
  // Tagged as special topic type, these aren't regular pages
  tags: ['type/topic'],
  // Do not display page meta data
  hide_meta: true,
  folder: ['topic'],
  // TODO: does this need setting at the taxonomy folder level?
  layout: 'layouts/page-index.njk',
  sidebar_component: 'topic',

  eleventyComputed: {
    statistics_collection(data) {
      return data.collections.topics.find(({topic}) => topic === (data.topic ?? data.title));
    },
    permalink(data) {
      return `topic/${data.page.fileSlug}/`;
    },
    sidebar_title(data) {
      return 'Writing tagged as “' + (data.topic || data.title) + '”'
    },
    sidebar_topic(data) {
      return data.topic || data.title;
    }
  },
}
