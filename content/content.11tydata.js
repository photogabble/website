module.exports = {
  featured: false,
  draft: false,
  layout: 'layouts/post.njk',
  growthStage: 'seedling', // seedling, budding, evergreen
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    permalink(data) {
      return `blog/${data.categories[0]}/${this.slugify(data.title)}/`
    }
  }
};