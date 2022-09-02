module.exports = {
  contentType: 'colophon', // thought, noteworthy, essay, tutorial, project, mirror
  excludeFromFeed: true,
  eleventyComputed: {
    permalink(data) {
      return `colophon/update/${this.slugify(data.title)}/`
    }
  }
};