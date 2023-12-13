const {getChanges} = require("../../lib/helpers/get-git-changes");
const {slugify, ogImageFromSlug} = require('../../lib/filters');

module.exports = {
  featured: false,
  draft: false,
  excludeFromFeed: false,
  layout: 'layouts/page-post.njk',
  growthStage: 'seedling', // seedling, budding, evergreen
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project
  folder: ['writing'],
  eleventyComputed: {
    changes: data => getChanges(data),
    permalink(data) {
      const path = data?.permalinkBase ?? data.contentType;
      const slug = data?.slug ?? this.slugify(data.title);
      return `${path}/${slug}/`;
    },
    ogImageHref: (data) => ogImageFromSlug(slugify(data.title)),
  }
};