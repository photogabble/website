const {slugify, ogImageFromSlug} = require('../utils/filters');

module.exports = {
  featured: false,
  draft: false,
  excludeFromFeed: false,
  layout: 'layouts/post.njk',
  growthStage: 'seedling', // seedling, budding, evergreen
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project
  folder: ['writing'],
  eleventyComputed: {
    ogImageHref: (data) => ogImageFromSlug(slugify(data.title)),
  }
};