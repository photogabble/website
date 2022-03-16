module.exports = {
  featured: false,
  draft: false,
  layout: "layouts/post.njk",
  eleventyComputed: {
    permalink(data) {
      return `blog/${ data.categories[0] }/${ this.slugify(data.title) }/`
    }
  }
};