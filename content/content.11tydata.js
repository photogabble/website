const {backlinks} = require('../utils/helpers')

module.exports = {
  featured: false,
  draft: false,
  excludeFromFeed: false,
  layout: 'layouts/post.njk',
  growthStage: 'seedling', // seedling, budding, evergreen
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project
  eleventyComputed: {
    backlinks: (data) => {
      return backlinks(data)
    }
  }
};