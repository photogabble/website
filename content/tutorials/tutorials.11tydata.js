module.exports = {
  contentType: 'tutorial', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    permalink(data) {
      return `tutorials/${this.slugify(data.title)}/`
    }
  }
};