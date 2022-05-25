module.exports = {
  contentType: 'project', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    permalink(data) {
      return `projects-2/${this.slugify(data.title)}/`
    }
  }
};