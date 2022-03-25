module.exports = {
  featured: false,
  draft: false,
  layout: 'layouts/post.njk',
  growthStage: 'seedling', // seedling, budding, evergreen
  eleventyComputed: {
    permalink(data) {
      return `blog/${data.categories[0]}/${this.slugify(data.title)}/`
    }
  }
};