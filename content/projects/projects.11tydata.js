module.exports = {
  layout: "layouts/project.njk",
  contentType: 'project', // thought, noteworthy, essay, tutorial, project
  language: null,
  status: null,
  eleventyComputed: {
    permalink(data) {
      return `projects/${this.slugify(data.title)}/`
    }
  }
};