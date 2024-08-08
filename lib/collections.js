import chunk from './helpers/chunk.js';
import {slugify, padStart, specialTagMeta} from './filters.js';
import listData from '../src/_data/lists-meta.js';
import metadata from "../src/_data/metadata.js";

const specialTagData = {...metadata.specialTags, ...listData};

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

const resourcesByType = (collection) => collectSpecialTaggedContent(
  'resource/',
  collection,
  './src/content/resources/**/*.md'
);
  // .reduce((carry, item) => {
  //
  //   return carry;
  // }, []);

const nowUpdates = (collection) => post(collection, './src/now/*.md');

/**
 * Collects
 * @param {String} prefix
 * @param {*} collection
 * @param {String} glob
 * @return {Array<{name: string, description: string, title: string, items: Array<*>, slug: string, url: string}>}
 */
const collectSpecialTaggedContent = (prefix, collection, glob = './src/content/**/*.md') => Array.from(
  post(collection, glob).reduce((lists, post) => {
    if (post.data?.tags) {
      for (const tag of post.data.tags) {
        if (!tag.startsWith(prefix)) continue;
        lists.add(tag);
      }
    }
    return lists;
  }, new Set(),)
).map(list => {
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
const lists = (collection) => collection.getFilteredByTag('type/list').map(item => {
  const slug = item.data?.list_slug ?? item.fileSlug;

  return {
    title: item.data.title,
    description: item.data?.description,
    url: item.url,
    slug,
    list_category: item.data.list_category,
    items: collection.getFilteredByTag(`list/${slug}`).reverse(),
  }
});

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

const topics = (collection) => Array.from(post(collection).reduce((carry, page) => {
  if (!page.data?.tags) return carry;

  for (const tag of page.data.tags) {
    if (tag.includes('/')) continue; // We handle special tags separately
    const list = carry.get(tag) ?? {
      name: tag,
      items: [],
    };
    list.items.push(page);
    carry.set(tag, list);
  }

  return carry;
}, new Map()).values());



export const registerCollections = (eleventyConfig) => {
  eleventyConfig.addCollection('lists', lists);
  eleventyConfig.addCollection('series', series);
  eleventyConfig.addCollection('topics', topics);
  eleventyConfig.addCollection('nowUpdates', nowUpdates);
  eleventyConfig.addCollection('resourcesByType', resourcesByType);
};
