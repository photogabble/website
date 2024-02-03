const getPageFolders = (page) => page.filePathStem.substring(
  page.filePathStem.indexOf('resources/') + 'resources/'.length,
  page.filePathStem.indexOf(`/${page.fileSlug}`)
);

const getPageResourceType = (page) => getPageFolders(page).split('/')[0];

module.exports = {
  layout: "layouts/page-resource.njk",
  titlePrefix: 'Resource',
  headingClass: 'resource',
  contentType: 'resource',
  excludeFromFeed: true,
  eleventyComputed: {
    permalink(data) {
      const folders = getPageFolders(data.page);
      return `resources/${folders}/${this.slugify(data.title)}/`
    },

    folder(data) {
      const resourceType = getPageResourceType(data.page);

      return [
        'resource',
        {href: `/resources/${resourceType}/`, text: resourceType, title: 'Goto Archive of all resources'}
      ];
    },

    /**
     * Resource Type is the base folder of a resource.
     * @param data
     * @returns {string}
     */
    resourceType(data) {
      return getPageResourceType(data.page);
    },
  }
};
