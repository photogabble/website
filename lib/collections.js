import chunk from './helpers/chunk.js';
import {slugify, padStart, specialTagMeta} from './filters.js';
import listData from '../src/_data/lists-meta.js';

// This function returns a reducer function for paginating custom taxonomy such as
// the content types used in this digital garden.
//
// Written with inspiration from:
// @see https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
// @todo make compatible with 11tys official pagination interface
// @todo add test
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

// Filter draft posts when deployed into production
const post = (collection, glob = './src/content/**/*.md') => ((process.env.ELEVENTY_ENV !== 'production')
    ? [...collection.getFilteredByGlob(glob)]
    : [...collection.getFilteredByGlob(glob)].filter((post) => !post.data.draft)
);

// Written for #20, this creates a collection of all tags
// @see https://github.com/photogabble/website/issues/20
const contentTags = (collection) => Array.from(
  post(collection).reduce((tags, post) => {
    if (post.data.tags) post.data.tags.forEach(tag => !tag.includes('list/') && tags.add(tag));
    return tags;
  }, new Set())
).map(name => {
  return {
    name,
    slug: slugify(name),
    items: collection.getFilteredByTag(name).filter((item) => item.data.growthStage && item.data.growthStage !== 'stub').reverse()
  }
}).filter(name => name.items.length > 0 && !name.name.includes(':'))
  .sort((a, b) => b.items.length - a.items.length);

const contentTypes = (collection) => Object.values(post(collection).reverse().reduce((types, post) => {
  const section = (post.data.growthStage && post.data.growthStage === 'stub')
    ? 'stub'
    : post.data.contentType;

  if (post.data.contentType && types[section]) types[section].items.push(post);

  return types;
}, {
  stub: {
    id: 'stub',
    name: 'Stubs',
    slug: 'stubs',
    items: [],
  },
  glossary: {
    id: 'glossary',
    name: 'Glossary',
    slug: 'glossary',
    items: [],
  },
  thought: {
    id: 'thought',
    name: 'Thoughts',
    slug: 'thoughts',
    items: [],
  }, noteworthy: {
    id: 'noteworthy',
    name: 'Noteworthy',
    slug: 'noteworthy',
    items: []
  }, essay: {
    id: 'essay',
    name: 'Essays',
    slug: 'essays',
    items: []
  }, tutorial: {
    id: 'tutorial',
    name: 'Tutorials',
    slug: 'tutorials',
    items: []
  }, project: {
    id: 'project',
    name: 'Projects',
    slug: 'projects',
    items: []
  }, mirror: {
    id: 'mirror',
    name: 'Mirrored Code Snippets',
    slug: 'mirrored',
    items: []
  }, changelog: {
    id: 'changelog',
    name: 'Changelog',
    slug: 'changelog',
    items: []
  }, resource: {
    id: 'resource',
    name: 'Resources',
    slug: 'resources',
    items: [],
  }
}));

const resources = (collection) => contentTypes(collection)
  .find(type => type.id === 'resource')
  .items;

const resourcesPaginatedByType = (collection) => Array.from(resources(collection).reduce((types, post) => {
  if (!post.data.resourceType) return types;

  const id = post.data.resourceType;
  const resourceType = types.get(post.data.resourceType) || {
    id,
    name: id,
    slug: `resources/${id}/`,
    items: [],
  };

  resourceType.items.push(post);
  types.set(id, resourceType);

  return types;
}, new Map()).values()).reduce(paginateContentTaxonomy(), []);

const contentPaginatedByType = (collection) => contentTypes(collection)
  .filter(type => ['project', 'resource', 'glossary'].includes(type.id) === false)
  .reduce(paginateContentTaxonomy(), []);

const contentPaginatedByTopic = (collection) => contentTags(collection)
  .reduce(paginateContentTaxonomy('topic/'), []);

const contentPaginatedByYearMonth = (collection) => Array.from(post(collection)
  .filter(post => ['mirror', 'resource'].includes(post.data.contentType) === false)
  .reduce((carry, post) => {
    const key = `${post.date.getFullYear()}/${post.date.getMonth()}`;
    const month = (post.date.getMonth() + 1);
    const segment = carry.get(key) ?? {
      title: `Planted in ${post.date.toLocaleString('en-us', {month: 'long'})}/${post.date.getFullYear()}`,
      slug: `${post.date.getFullYear()}/${padStart(month, 2, '0')}`,
      pageNumber: 1,
      totalPages: 1,
      items: [],
    };

    if (post.data.growthStage && post.data.growthStage !== 'stub') segment.items.push(post);

    carry.set(key, segment);
    return carry;
  }, new Map()).values());

const nowUpdates = (collection) => post(collection, './src/now/*.md');

const collectSpecialTaggedContent = (prefix, collection) => Array.from(
  post(collection).reduce((lists, post) => {
    if (post.data?.tags) {
      for (const tag of post.data.tags) {
        if (!tag.startsWith(prefix)) continue;
        lists.add(tag);
      }
    }
    return lists;
  }, new Set(),)
).map(list => {
  const n = collection.getFilteredByTag(list).reverse();
  return {
    ...specialTagMeta(list),
    items: collection.getFilteredByTag(list).reverse(),
  };
});

/**
 * Lists and Collections of posts into a special grouping.
 *
 * This is used for displaying special pages such as the blog roll which is essentially
 * a special view on bookmark posts tagged with list/blogroll. Week in Review and my
 * 365-Day project's also have special views for their output.
 *
 * Lists are canonically different to topics, while topics are groupings of different posts that
 * are taxonomically similar, lists and collections are groupings of different posts
 * that might never have overlapping topics.
 *
 * @param collection
 * @return {{name: string, description: string, title: string, items: *, slug: string, url: string}[]}
 */
const lists = (collection) => collectSpecialTaggedContent('list/', collection);

/**
 * Post Series.
 *
 * This is used for grouping tightly coupled posts into a series. It's similar to lists,
 * however while a list might include a lot of different posts under one banner, a
 * series is one giant post that has been split over several pages. This is
 * useful for long-running tutorial series and dev-logs.
 *
 * Posts within a series can display their Series Listing for quick navigation
 * between series posts.
 *
 * @param collection
 * @return {{name: string, description: string, title: string, items: *, slug: string, url: string}[]}
 */
const series = (collection) => collectSpecialTaggedContent('series/', collection);

export const registerCollections = (eleventyConfig) => {
  eleventyConfig.addCollection('lists', lists);
  eleventyConfig.addCollection('series', series);
  eleventyConfig.addCollection('nowUpdates', nowUpdates);
};
