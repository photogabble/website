const getPageFolders = (page) => page.filePathStem.substring(
  page.filePathStem.indexOf('resources/') + 'resources/'.length,
  page.filePathStem.indexOf(`/${page.fileSlug}`)
);

module.exports = {
  layout: "layouts/resource.njk",
  contentType: 'resource', // thought, noteworthy, essay, tutorial, project, mirror
  excludeFromFeed: true,
  eleventyComputed: {
    permalink(data) {
      const folders = getPageFolders(data.page);
      return `resources/${folders}/${this.slugify(data.title)}/`
    },
    resourceId(data) {
      const folders = getPageFolders(data.page);
      return `${folders}/${this.slugify(data.title)}`;
    }
  }
};