const {toTitleCase, strToSlug} = require('./helpers');
const {DateTime} = require('luxon');
const metadata = require('../_data/metadata');
const readingTime = require('reading-time');
const path = require('path');
const fs = require('fs');
/**
 * Filters
 * @link https://www.11ty.dev/docs/filters/
 * @see https://github.com/11ta/11ta-template/blob/main/utils/filters.js
 */
module.exports = {
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
  dateToFormat: (date, format) => {
    return DateTime.fromJSDate(date, {
      zone: 'utc',
    }).toFormat(String(format))
  },

  /**
   * Universal slug filter strips unsafe chars from URLs
   *
   * @param string {string}
   * @returns {string}
   */
  slugify: (string) => strToSlug(string),

  /**
   * Takes a list of slugs and returns them converted to title case.
   *
   * @param list {Array<string>}
   * @return array {Array<{slug:string, title:string}>}
   */
  formatSlugList: (list) => {
    return list.map((slug) => {
      return {
        slug,
        title: toTitleCase(slug)
      }
    })
  },

  findBySlug: (collection, slug) => {
    return (!slug)
      ? collection
      : collection.find((item) => item.slug === slug);
  },

  values: (obj, key) => obj[key],

  whereKeyEquals: (collection, key, value) => collection.filter(item => item[key] === value || (item.data && item.data[key] === value)),

  /**
   * Takes a list of tags and returns them mapped with url slug.
   *
   * @param list {Array<string>}
   * @returns {Array<{name:string, slug:string}>}
   */
  formatTagList: (list) => {
    return list.map((tag) => {
      return {
        name: tag,
        slug: strToSlug(tag)
      }
    })
  },

  /**
   * Takes a list and returns the limit number of items.
   *
   * @param array {Array<any>}
   * @param limit {number}
   * @returns {Array<any>}
   */
  limit: (array, limit) => array.slice(0, limit),

  excludeStubs: (collection) => collection.filter(item => item.data.growthStage && item.data.growthStage !== 'stub'),

  excludeType: (collection, type) => {
    return (!type)
      ? collection
      : collection.filter(item => item.data.contentType !== type);
  },

  excludeTypes: (collection, types = []) => (
    types.length > 0
      ? collection.filter(item => types.includes(item.data.contentType) === false)
      : collection
  ),

  onlyTypes: (collection, types = []) => (
    types.length > 0
      ? collection.filter(item => types.includes(item.data.contentType))
      : collection
  ),

  onlyType: (collection, type) => {
    return (!type)
      ? collection
      : collection.filter(item => item.data.contentType === type);
  },

  withoutFeatured: (collection) => collection.filter(item => {
    return !item.data.featured
  }),

  onlyFeatured: (collection) => collection.filter(item => {
    return item.data.featured && item.data.featured === true;
  }),

  debug: (...args) => {
    console.log(...args)
    debugger;
  },

  ogImageFromSlug: (slug) => {
    const filename = `${slug}.jpg`;
    const filepath = path.join(process.cwd(), `_assets/og-image/${filename}`);

    return fs.existsSync(filepath)
      ? `${metadata.url}/img/og-image/${filename}`
      : null;
  },

  /**
   * Check if a given tag list contains a slug.
   *
   * @param tags {Array<string>}
   * @param slug {string}
   * @returns {boolean}
   */
  includesTag: (tags, slug) => tags.find(tag => tag.toLowerCase() === slug.toLowerCase()) !== undefined,

  /**
   * Group a collection by year.
   *
   * @param collection
   * @returns {*}
   */
  groupByYear: (collection) => collection
    .reduce((carry, post) => {
      const year = post.date.getFullYear();
      const group = carry.get(year) ?? [];
      group.push(post);
      carry.set(year, group);
      return carry;
    }, new Map()),

  /**
   * Group a collection by month.
   * @param collection
   * @returns {*}
   */
  groupByMonth: (collection) => collection
    .reduce((carry, post) => {
      const month = post.date.getMonth();
      const group = carry.get(month) ?? [];
      group.push(post);
      carry.set(month, group);
      return carry;
    }, new Map()),

  padStart: (str, len, filler) => String(str).padStart(len, filler),

  /**
   * Takes a 11ty collection and returns a stats object for presentation
   * TODO: turn this into a 11ty plugin...
   */
  collectionStats: (collection) => {
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
  },
}
