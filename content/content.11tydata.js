const {backlinks} = require('../utils/helpers');
const {slugify, ogImageFromSlug} = require('../utils/filters');

module.exports = {
  featured: false,
  draft: false,
  excludeFromFeed: false,
  layout: 'layouts/post.njk',
  growthStage: 'seedling', // seedling, budding, evergreen
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project
  folder: [ 'writing'],
  eleventyComputed: {
    backlinks: (data) => backlinks(data),
    ogImageHref: (data) => ogImageFromSlug(slugify(data.title)),
  }
};