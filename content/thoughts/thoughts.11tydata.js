module.exports = {
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    permalink(data) {
      return `thoughts/${this.slugify(data.title)}/`
    }
  }
};