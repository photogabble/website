module.exports = {
  contentType: 'essay', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    permalink(data) {
      return `essays/${this.slugify(data.title)}/`
    }
  }
};