const {toTitleCase, strToSlug} = require('./helpers');
const metadata = require('../src/_data/metadata');
const listData = require('../src/_data/lists-meta');
const readingTime = require('reading-time');
const {DateTime} = require('luxon');
const path = require('path');
const fs = require('fs');
/**
 * Filters
 * @link https://www.11ty.dev/docs/filters/
 * @see https://github.com/11ta/11ta-template/blob/main/utils/filters.js
 */

/**
 * dateToFormat allows specifying display format at point of use.
 * Example in footer: {{ build.timestamp | dateToFormat('yyyy') }} uses .timestamp
 * from the _data/build.js export and formats it via dateToFormat.
 * Another usage example used in layouts: {{ post.date | dateToFormat("LLL dd, yyyy") }}
 * And finally, example used in /src/posts/posts.json to format the permalink
 * when working with old /yyyy/MM/dd/slug format from WordPress exports.
 *
 * @param date {Date}
 * @param format {string}
 * @returns {string}
 */
const dateToFormat = (date, format) => {
  return DateTime.fromJSDate(date, {
    zone: 'utc',
  }).toFormat(String(format))
};

/**
 * Universal slug filter strips unsafe chars from URLs
 *
 * @param string {string}
 * @returns {string}
 */
const slugify = (string) => strToSlug(string);

/**
 * Takes a list of slugs and returns them converted to title case.
 *
 * @param list {Array<string>}
 * @return array {Array<{slug:string, title:string}>}
 */
const formatSlugList = (list) => {
  return list.map((slug) => {
    return {
      slug,
      title: toTitleCase(slug)
    }
  })
};

const findBySlug = (collection, slug) => {
  return (!slug)
    ? collection
    : collection.find((item) => item.slug === slug);
};

const values = (obj, key) => obj[key];

const randomItems = (arr, count) => {
  if (!Array.isArray(arr)) throw new Error('arr must be array');
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

const whereKeyEquals = (collection, key, value) => collection.filter(item => item[key] === value || (item.data && item.data[key] === value));

const whereFileSlugEquals = (collection, value) => {
  return (collection)
    ? collection.find(item => item.fileSlug === value)
    : undefined;
};

/**
 * Is the given tag a special tag? Special tags are used to denote content that belongs to a list
 * or series with the prefix: list/ or series/. Other special tags might exist in-future, but
 * at time of writing only the aforementioned are used.
 *
 * @param tag {string}
 * @return {boolean}
 */
const isSpecialTag = (tag) => tag.includes('/');

/**
 * Takes a special tag and returns its meta-data.
 *
 * @todo make this work for all tags...
 * @param list {string}
 * @return {{title: string, description: string, name: string, slug: string, url: string }}
 */
const specialTagMeta = (list) => {
  const idx = list.lastIndexOf('/');
  const name = list.substring(idx + 1);
  const slug = strToSlug(name);
  const meta = listData[list] ?? {title: name, description: ''};
  const permalink = meta.permalink ?? `/lists/${slug}/`;

  return {
    ...meta,
    name,
    slug,
    permalink,
  };
};

/**
 * Takes a list of tags and returns them mapped as topic or list items.
 *
 * @param list {Array<string>}
 * @returns {Array<{title: string, description: string, slug:string, url: string}>}
 */
const formatTagList = (list) => {
  return (list)
    ? list.map((tag) => {

      if (isSpecialTag(tag)) {
        return specialTagMeta(tag);
      }

      const slug = strToSlug(tag);

      return {
        title: tag,
        description: '',
        slug,
        permalink: `/topic/${slug}`,
      }
    })
    : [];
};

/**
 * Takes a list and returns the limit number of items.
 *
 * @param array {Array<any>}
 * @param limit {number}
 * @returns {Array<any>}
 */
const limit = (array, limit) => array.slice(0, limit);

const excludeStubs = (collection) => collection.filter(item => item.data.growthStage && item.data.growthStage !== 'stub');

const excludeType = (collection, type) => {
  return (!type)
    ? collection
    : collection.filter(item => item.data.contentType !== type);
};

const excludeTypes = (collection, types = []) => (
  types.length > 0
    ? collection.filter(item => types.includes(item.data.contentType) === false)
    : collection
);

const onlyGrowthStages = (collection, stages) => {
  if (!Array.isArray(stages)) stages = [stages];
  return collection.filter(item => stages.includes(item.data.growthStage ?? 'unknown'));
}

const onlyTypes = (collection, types = []) => (
  types.length > 0
    ? collection.filter(item => types.includes(item.data.contentType))
    : collection
);

const onlyType = (collection, type) => {
  return (!type)
    ? collection
    : collection.filter(item => item.data.contentType === type);
};

const withoutFeatured = (collection) => collection.filter(item => {
  return !item.data.featured
});

const onlyFeatured = (collection) => collection.filter(item => {
  return item.data.featured && item.data.featured === true;
});

const debug = (...args) => {
  console.log(...args)
  debugger;
};

const ogImageFromSlug = (slug) => {
  const filename = `${slug}.jpg`;
  const filepath = path.join(process.cwd(), `_assets/og-image/${filename}`);

  return fs.existsSync(filepath)
    ? `${metadata.url}/img/og-image/${filename}`
    : null;
};

/**
 * Check if a given tag list contains a slug.
 *
 * @param tags {Array<string>}
 * @param slug {string}
 * @returns {boolean}
 */
const includesTag = (tags, slug) => tags.find(tag => tag.toLowerCase() === slug.toLowerCase()) !== undefined;

/**
 * Excludes special tags denoted by `:`
 *
 * @param tags
 * @returns {*}
 */
const excludeSpecialTags = (tags) => tags.filter(tag => tag.includes(':') === false);

/**
 * Group a collection by year.
 *
 * @param {Array<any>} collection
 * @returns {Map<number, Array<any>>}
 */
const groupByYear = (collection) => collection.reduce((carry, post) => {
  const year = post.date.getFullYear();
  const group = carry.get(year) ?? [];
  group.push(post);
  carry.set(year, group);
  return carry;
}, new Map());

/**
 * Group a collection by month.
 * @param {Array<any>} collection
 * @returns {Map<number, Array<any>>}
 */
const groupByMonth = (collection) => collection.reduce((carry, post) => {
  const month = post.date.getMonth();
  const group = carry.get(month) ?? [];
  group.push(post);
  carry.set(month, group);
  return carry;
}, new Map());

/**
 * Group a collection by item data key.
 * @param {Array<any>} collection
 * @param {string} key
 * @return {Map<string, Array<any>>}
 */
const groupByKey = (collection, key) => collection.reduce((carry, post) => {
  const value = post.data[key] ?? 'unknown';
  const group = carry.get(value) ?? [];
  group.push(post);
  carry.set(value, group);
  return carry;
}, new Map());

const padStart = (str, len, filler) => String(str).padStart(len, filler);

const ratingToStars = (rating, max = 5) => {
  if (rating > max) rating = max;
  return '★'.repeat(rating).concat(Math.ceil(rating) !== rating ? '½' : '');
};

const seriesPosts = (collection, name) => {
  const key = `series:${name}`;
  if (!collection.hasOwnProperty(key)) return undefined;
  const posts = collection[key] ?? [];

  const collator = new Intl.Collator('en');

  return posts.sort((a, b) => {
    if (a.data.group && b.data.group) return collator.compare(a.data.group, b.data.group);

    if (!a.data.group && b.data.group) return -1;
    if (a.data.group && !b.data.group) return 1;

    return 0;
  });
};

/**
 * Takes a 11ty collection and returns a stats object for presentation
 * TODO: turn this into a 11ty plugin...
 */
const collectionStats = (collection) => {
  const numberFormatter = new Intl.NumberFormat('en-GB', {maximumSignificantDigits: 3});

  const stats = collection.reduce((stats, item) => {
    stats.totalItems++;
    if (stats.firstItem === null) stats.firstItem = item;

    const itemStats = readingTime(item.templateContent)
    const wordCount = itemStats.words;

    if (wordCount > stats.longestItem.wordCount) {
      stats.longestItem.wordCount = wordCount;
      stats.longestItem.item = item;
    }

    stats.totalWords += wordCount;

    // Year stats
    const year = item.date.getFullYear();
    const yearStats = stats.byYear.get(year) ?? {
      year,
      totalWords: 0,
      totalItems: 0,
    };

    yearStats.totalItems++;
    yearStats.totalWords += wordCount;

    stats.byYear.set(year, yearStats);

    return stats;
  }, {
    totalWords: 0,
    totalItems: 0,
    firstItem: null,
    longestItem: {
      wordCount: 0,
      item: null,
    },
    byYear: new Map()
  });

  // Number formatting

  stats.avgWords = stats.totalItems > 0
    ? numberFormatter.format(stats.totalWords / stats.totalItems)
    : 0;

  stats.totalWords = numberFormatter.format(stats.totalWords);
  stats.totalItems = numberFormatter.format(stats.totalItems);
  stats.longestItem.wordCount = numberFormatter.format(stats.longestItem.wordCount);

  stats.byYear = Array.from(stats.byYear.values())
    .map(year => {
      return {
        ...year,
        totalWords: numberFormatter.format(year.totalWords),
        totalItems: numberFormatter.format(year.totalItems),
        avgWords: year.totalItems > 0
          ? numberFormatter.format(year.totalWords / year.totalItems)
          : 0
      }
    }).sort((a, b) => a.year - b.year);

  return stats;
};

/**
 * Takes a list of names or pages and returns a map with them sorted into A-Z + #, ? buckets.
 *
 * @see https://github.com/benjifs/benji/blob/65e82aade03efde17cb04c31ce4f13d59dbfeff3/.eleventy.js#L71-L85
 * @param collection
 * @returns {Map<any, any>}
 */
const alphabetSort = (collection) => {
  const alphabet = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '?']

  const sorted = alphabet.reduce((res, letter) => {
    res.set(letter, [])
    return res
  }, new Map())

  for (let item of collection) {
    const title = (typeof item === 'string')
      ? item
      : item?.data?.title;

    if (!title) continue;

    let key = (title[0] || '?').toUpperCase();
    key = alphabet.includes(key) ? key : (!isNaN(key) ? '#' : '?');
    sorted.get(key).push((typeof item === 'string') ? title : item);
  }
  return sorted;
};

module.exports = {
  dateToFormat,
  slugify,
  isSpecialTag,
  specialTagMeta,
  formatSlugList,
  findBySlug,
  values,
  whereKeyEquals,
  whereFileSlugEquals,
  formatTagList,
  limit,
  excludeStubs,
  excludeType,
  excludeTypes,
  onlyGrowthStages,
  onlyTypes,
  onlyType,
  withoutFeatured,
  onlyFeatured,
  debug,
  ogImageFromSlug,
  includesTag,
  excludeSpecialTags,
  groupByYear,
  groupByMonth,
  groupByKey,
  padStart,
  ratingToStars,
  seriesPosts,
  collectionStats,
  alphabetSort,
  randomItems,
};
