module.exports = {
  contentType: 'noteworthy', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    permalink(data) {
      return `noteworthy/${this.slugify(data.title)}/`
    }
  }
};