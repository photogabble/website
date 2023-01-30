module.exports = {
  contentType: 'glossary', // stub, glossary, thought, noteworthy, essay, tutorial, project,
  eleventyComputed: {
    permalink(data) {
      return `glossary/${this.slugify(data.title)}/`
    }
  }
};