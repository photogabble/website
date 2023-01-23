const {chunk} = require('./helpers')
const {slugify} = require("./filters");

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

const md = require('markdown-it')()
  .use(require('markdown-it-hashtag'), {
    hashtagRegExp: '(?!\\d+\\b)\\w{3,}'
  });

// Filter draft posts when deployed into production
const post = (collection) => ((process.env.ELEVENTY_ENV !== 'production')
    ? [...collection.getFilteredByGlob('./content/**/*.md')]
    : [...collection.getFilteredByGlob('./content/**/*.md')].filter((post) => !post.data.draft)
).map(post => {
  if (!post.data.hashtagsMapped) {
    // Identify Hashtags and append to Tags
    const tags = new Set(post.data.tags ?? []);
    const found = new Set();
    const content = post.template?.frontMatter?.content;

    // Only do the expensive markdown parse if content contains potential hashtags
    if (content && content.match(/#([\w-]+)/g)) {
      const tokens = md.parseInline(content, {});
      for (const token of tokens) {
        for (const child of token.children) {
          if (child.type === 'hashtag_text') found.add(child.content);
        }
      }

      if (found.size > 0) {
        found.forEach(tag => {
          tags.add(tag);
        });

        post.data.tags = Array.from(tags);
      }
    }
    // Mark this post as processed, so we don't do so again each time this collection is requested
    post.data.hashtagsMapped = true;
  }

  return post;
});

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
  if (post.data.growthStage && post.data.growthStage !== 'stub') types[post.data.contentType].items.push(post);
  return types;
}, {
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

module.exports = {
  post,
  contentTags,
  contentTypes,
  contentPaginatedByType,
  contentPaginatedByTopic,
  nowUpdates
}
