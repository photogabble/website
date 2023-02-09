module.exports = {
  layout: "layouts/resource.njk",
  contentType: 'resource', // thought, noteworthy, essay, tutorial, project, mirror
  excludeFromFeed: true,
  eleventyComputed: {
    permalink(data) {
      return `resource/${this.slugify(data.title)}/`
    }
  }
};