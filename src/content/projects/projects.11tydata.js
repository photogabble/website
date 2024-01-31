module.exports = {
  layout: "layouts/page-project.njk",
  contentType: 'project',
  permalinkBase: 'projects',
  language: null,
  status: null,
  eleventyComputed: {
    permalink(data) {
      return `projects/${this.slugify(data.title)}/`
    }
  }
};
