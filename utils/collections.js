const {chunk} = require('./helpers')
const {slugify} = require("./filters");
const {setupMarkdownIt, parseCollectionHashtags} = require ('./helpers/hashtags');

// Written with inspiration from:
// @see https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
const paginateContentTaxonomy = (baseSlug = '', perPage = 10) => {
  return (pages, taxonomy) => {
    const slugs = [];
    const chunks = chunk(taxonomy.items, perPage);
    chunks.forEach((content, idx) => {
      slugs.push(idx > 0
        ? `${baseSlug}${taxonomy.slug}/${idx + 1}`
        : `${baseSlug}${taxonomy.slug}`)
    });
    const totalPages = slugs.length;
    chunks.forEach((items, idx) => {
      pages.push({
        title: taxonomy.name,
        slug: slugs[idx],
        pageNumber: idx + 1,
        totalPages,
        pageSlugs: {
          all: slugs,
          next: slugs[idx + 1] || null,
          previous: slugs[idx - 1] || null,
          first: slugs[0] || null,
          last: slugs[slugs.length - 1] || null
        },
        items
      })
    });
    return pages;
  };
};

const md = setupMarkdownIt(require('markdown-it')());

module.exports = function loadCollection(eleventyConfig) {
  // Filter draft posts when deployed into production
  const post =  (collection) => ((process.env.ELEVENTY_ENV !== 'production')
      ? [...collection.getFilteredByGlob('./content/**/*.md')]
      : [...collection.getFilteredByGlob('./content/**/*.md')].filter((post) => !post.data.draft)
  ).map(parseCollectionHashtags(md, eleventyConfig.globalData.tagAtlas));

// Written for #20, this creates a collection of all tags
// @see https://github.com/photogabble/website/issues/20
  const contentTags = (collection) => Array.from(
    post(collection).reduce((tags, post) => {
      if (post.data.tags) post.data.tags.forEach(tag => tags.add(tag));
      return tags;
    }, new Set())
  ).map(name => {
    return {
      name,
      slug: slugify(name),
      items: collection.getFilteredByTag(name).filter((item) => item.data.growthStage && item.data.growthStage !== 'stub').reverse()
    }
  }).sort((a, b) => b.items.length - a.items.length);

  const contentTypes = (collection) => Object.values(post(collection).reverse().reduce((types, post) => {
    const section = (post.data.growthStage && post.data.growthStage === 'stub')
      ? 'stub'
      : post.data.contentType;

    if (post.data.contentType) types[section].items.push(post);

    return types;
  }, {
    stub: {
      name: 'Stubs',
      slug: 'stubs',
      items: [],
    },
    thought: {
      name: 'Thoughts',
      slug: 'thoughts',
      items: [],
    }, noteworthy: {
      name: 'Noteworthy',
      slug: 'noteworthy',
      items: []
    }, essay: {
      name: 'Essays',
      slug: 'essays',
      items: []
    }, tutorial: {
      name: 'Tutorials',
      slug: 'tutorials',
      items: []
    }, project: {
      name: 'Projects',
      slug: 'projects',
      items: []
    }, mirror: {
      name: 'Mirrored Code Snippets',
      slug: 'mirrored',
      items: []
    }, colophon: {
      name: 'Colophon',
      slug: 'colophon/update',
      items: []
    }
  }));

  const contentPaginatedByType = (collection) => contentTypes(collection)
    .filter(type => type.slug !== 'projects')
    .reduce(paginateContentTaxonomy(), []);

  const contentPaginatedByTopic = (collection) => contentTags(collection)
    .reduce(paginateContentTaxonomy('topic/'), []);

  const nowUpdates = (collection) => [...collection.getFilteredByGlob('./now/*.md')
    .filter((post) => !post.data.draft)];

  return {
    post,
    contentTags,
    contentTypes,
    contentPaginatedByType,
    contentPaginatedByTopic,
    nowUpdates
  }
}
