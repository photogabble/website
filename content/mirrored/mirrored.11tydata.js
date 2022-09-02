module.exports = {
  contentType: 'mirror', // thought, noteworthy, essay, tutorial, project, mirror
  excludeFromFeed: true,
  eleventyComputed: {
    permalink(data) {
      return `mirrored/${this.slugify(data.title)}/`
    }
  }
};