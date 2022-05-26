const {chunk, toTitleCase} = require('./helpers')
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
        pageNumber: idx+1,
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

// Filter draft posts when deployed into production
const post = (collection) => (process.env.ELEVENTY_ENV !== 'production')
  ? [...collection.getFilteredByGlob('./content/**/*.md')]
  : [...collection.getFilteredByGlob('./content/**/*.md')].filter((post) => !post.data.draft);

// TODO (#108): Replace postCategories and postByCategories with contentTypes and postByContentType

// Written for #20, this creates a collection of all tags
// @see https://github.com/photogabble/website/issues/20
const contentTags = (collection) => Array.from(
  post(collection).reduce((tags, post) => {
    if (post.data.tags) {
      post.data.tags.forEach(tag => tags.add(tag))
    }
    return tags;
  }, new Set())
).map(name => {
  return {
    name,
    slug: slugify(name),
    items: collection.getFilteredByTag(name).reverse()
  }
}).sort((a,b) => b.items.length - a.items.length);

const contentTypes = (collection) => Object.values(post(collection).reverse().reduce((types, post) => {
  types[post.data.contentType].items.push(post);
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
  }
}));

const contentPaginatedByType = (collection) => contentTypes(collection).filter(type => type.slug !== 'projects').reduce(paginateContentTaxonomy(), []);

const contentPaginatedByTopic = (collection) => contentTags(collection).reduce(paginateContentTaxonomy('topic/'), []);

// Collection of all categories found in blog collection
const postCategories = (collection) => {
  const posts = post(collection)
  return Array.from(posts.reduce((categories, post) => {
    if (post.data['categories']) {
      post.data['categories'].forEach(category => categories.add(category.toLowerCase()))
    }
    return categories
  }, new Set())).sort().map((category) => {
    return {
      title: toTitleCase(category),
      slug: category
    }
  })
}

// Collection of blog posts segmented by category.
// I wrote this based upon code found in the following article:
// https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
const postByCategories = (collection) => {
  const posts = post(collection).reverse()
  const postsPerPage = 20

  // Here we use a set to reduce the categories used in our posts into a unique list,
  // that set is then converted into an array and sorted alphabetically before being
  // mapped to equal an object containing the category slug and all posts that have
  // been categorised as it.

  return postCategories(collection).map((category) => {
    let slugs = []

    const chunks = chunk(posts.filter((post) => {
      let postCategories = post.data.categories || []
      return postCategories.includes(category.slug)
    }), postsPerPage)

    for (let i = 0; i < chunks.length; i++) {
      slugs.push(i > 0 ? `${category.slug}/${i + 1}` : category.slug)
    }

    let pages = [];

    // Convert our chunks into a struct that eleventy understands for pagination.
    chunks.forEach((posts, idx) => {
      pages.push({
        title: category.title,
        slug: slugs[idx],
        pageNumber: idx + 1,
        totalPages: slugs.length,
        pageSlugs: {
          all: slugs,
          next: slugs[idx + 1] || null,
          previous: slugs[idx - 1] || null,
          first: slugs[0] || null,
          last: slugs[slugs.length - 1] || null
        },
        items: posts
      })
    })
    return pages
  }).reduce((pages, all) => {
    // Each category was mapped as an array of pages, this needs
    // flattening for the final return.
    return [...all, ...pages]
  }, []);
}

// TODO: merge projects and now into contentTypes
const projects = (collection) => {
  return [...collection.getFilteredByGlob('./projects/*.md').filter((post) => !post.data.draft)];
}

const nowUpdates = (collection) => {
  return [...collection.getFilteredByGlob('./now/*.md').filter((post) => !post.data.draft)];
}

module.exports = {
  post,
  contentTags,
  contentTypes,
  contentPaginatedByType,
  contentPaginatedByTopic,
  postCategories,
  postByCategories,
  projects,
  nowUpdates
}
