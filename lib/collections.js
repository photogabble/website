import chunk from './helpers/chunk.js';
import {slugify, padStart, specialTagMeta, specialTagValue} from './filters.js';
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

/**
 * All Topics
 * Written for #20 (refactored for #324) this creates a collection of all tags.
 *
 * This is used by the topics sidebar for displaying all topics in order of how many post
 * they have, and by topic/topic.njk for generating per topic pages where one does not
 * already exist in src/content/topics.
 *
 * @see https://github.com/photogabble/website/issues/20
 * @see https://github.com/photogabble/website/issues/324
 * @param {*} collection
 * @return {Array<*>}
 */
const topics = (collection) => {
  // IndexPages are the main landing page for a topic, list or series; if they exist
  // then the pages frontmatter will be used as data source for the topic.
  const indexPages = [
    ...collection.getFilteredByTag('type/topic'),
    ...collection.getFilteredByTag('type/list'),
    ...collection.getFilteredByTag('type/stage'),
    ...collection.getFilteredByTag('type/series'),
    ...collection.getFilteredByTag('type/index'),
  ].reduce((carry, post) => {
    switch (specialTagValue(post?.data?.tags, 'type')) {
      case 'topic':
        carry.set((post.data?.topic ?? post.data.title), post);
        break;
      case 'stage':
        carry.set(`stage/${post.fileSlug}`, post);
        break;
      case 'list':
        carry.set(`list/${(post.data?.list_slug ?? post.fileSlug)}`, post);
        break;
      case 'series':
        carry.set(`series/${post.fileSlug}`, post);
        break;
      case 'index':
        (post.data?.topic ?? post.data?.sidebar_topic) &&
          carry.set((post.data?.topic ?? post.data?.sidebar_topic ?? post.data?.sidebar_resource), post);
        break;
    }
    return carry;
  }, new Map());

  // Some topics can have different ways of being referenced such as "Blogging" and "blogging"
  // being the same. While I might also want to merge some topics under one banner such as
  // "GameDev" and "GameDevelopment" -> "Game Development". In those cases a topic file
  // will be created which lists the topic_aliases for its topic.
  const topicMapping = collection.getFilteredByTag('type/topic').reduce((carry, post) => {
    // Topics that are set by a TopicIndexPage define the default representation for a topic.
    // For example, I might have a TopicIndexPage titled: "Game Development", it can then
    // define topic_aliases to say that "GameDev" and "GameDevelopment" reference it.
    const topic = (post.data?.topic ?? post.data.title);

    [
      ...(post.data?.topic_aliases ?? []),
      topic.toLowerCase(),
      topic.replace(/\s/g, '').toLowerCase(),
    ].forEach(t => carry.set(t, topic));

    return carry;
  }, new Map());

  // Set of unique tags that have been used in within all pages.
  const usedTopicSet = Array.from(post(collection).reduce((tags, post) => {
    post.data.tags && post.data.tags.forEach(tag => tags.add(tag));
    return tags;
  }, new Set()));

  // The usedTopicSet needs to be reduced into a list of topics that take into account the
  // topicMapping above.
  return Array.from(usedTopicSet.reduce((topics, topic) => {
    // Special topics contain a `/` some are canonically different in how they are handled
    const isSpecialTag = topic.includes('/');
    let name, description, permalink, page;
    let items = [];

    if (isSpecialTag) {
      const key = topic.split('/')[0];
      page = indexPages.get(topic);
      name = page?.data?.title ?? topic;
      permalink = page?.url ?? topic;
      items = collection.getFilteredByTag(topic);
    } else {
      // Normalise the topic for TopicMapping lookup, if no mapping is found then look up
      // IndexPage by the raw topic value. If found the IndexPage meta will determine the
      // topics title and slug.
      const uid = topic.replace(/\s/g, '').toLowerCase();
      page = (topicMapping.has(uid))
        ? indexPages.get(topicMapping.get(uid))
        : indexPages.get(topic);
      name = page?.data?.title ?? topic;
      permalink = page?.url ?? `/topic/${slugify(name)}`;
      items = collection.getFilteredByTag(name);
    }

    description = page?.data?.description;

    // const items = collection.getFilteredByTag(name)
    //   .filter((item) => (item.data?.tags ?? []).some(tag => ['stage/stub'].includes(tag)) === false)
    //   .reverse();

    if (permalink[0] !== '/') permalink = `/${permalink}`;
    const record = topics.get(name) ?? {topic, name, description, isSpecialTag, permalink, page, items: []};

    record.items = [...record.items, ...items];
    topics.set(name, record);

    return topics;
  }, new Map()).values())
    .map(el => {
      return {
        ...el,
        items: el.items.filter((item) => (item.data?.tags ?? []).some(tag => ['stage/stub'].includes(tag)) === false),
      }
    })
    .filter(topic => topic.items.length > 0 && topic.name !== 'writing')
    .sort((a, b) => b.items.length - a.items.length);
};

const resourcesByType = (collection) => collectSpecialTaggedContent({
  prefix: 'resource/',
  collection,
  glob: './src/content/resources/**/*.md',
});

const nowUpdates = (collection) => post(collection, './src/now/*.md');

/**
 * Collects pages that belong to a special tag e.g `series/*` collected into an
 * array with the tags meta plus its items.
 *
 * @param {prefix: string, collection: Array<any>, glob: string, excluded: Array<string>}
 * @return {Array<{name: string, description: string, title: string, items: Array<*>, slug: string, url: string}>}
 */
const collectSpecialTaggedContent = ({prefix, collection, glob = './src/content/**/*.md', excluded = []}) => Array.from(
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
const series = (collection) => collectSpecialTaggedContent({
  prefix: 'series/',
  collection,
});

export const registerCollections = (eleventyConfig) => {
  eleventyConfig.addCollection('lists', lists);
  eleventyConfig.addCollection('series', series);
  eleventyConfig.addCollection('topics', topics);
  eleventyConfig.addCollection('nowUpdates', nowUpdates);
  eleventyConfig.addCollection('resourcesByType', resourcesByType);
};
