import metadata from '../src/_data/metadata.js';
import listData from '../src/_data/lists-meta.js';
import {parse} from 'node-html-parser';
import readingTime from 'reading-time';
import {DateTime} from 'luxon';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { default as slugifyFn } from 'slugify';
import ColorThief from "colorthief";
import memoize from 'memoize';

const specialTagData = {...metadata.specialTags, ...listData};

/**
 * Filters
 * @link https://www.11ty.dev/docs/filters/
 * @see https://github.com/11ta/11ta-template/blob/main/utils/filters.js
 */

/**
 * 88x31 buttons may be an array or a string, when it's an array always return the
 * first element.
 * @param buttons {Array<string>|string}
 * @return {string}
 */
export const firstBtn = (buttons) => Array.isArray(buttons)
  ? buttons[0]
  : buttons;

/**
 * dateToFormat allows specifying display format at point of use.
 * Example in footer: {{ build.timestamp | dateToFormat('yyyy') }} uses .timestamp
 * from the _data/build.js export and formats it via dateToFormat.
 * Another usage example used in layouts: {{ post.date | dateToFormat("LLL dd, yyyy") }}
 * And finally, example used in /src/posts/posts.json to format the permalink
 * when working with old /yyyy/MM/dd/slug format from WordPress exports.
 *
 * This has been memoized due to the extensive number of times it gets called.
 *
 * @param date {Date}
 * @param format {string}
 * @returns {string}
 */
export const dateToFormat = memoize((date, format) => {
  if (typeof date === 'object' && typeof date.toFormat === 'function') {
    return (format === 'iso')
      ? date.toISO()
      : date.toFormat(String(format));
  }

  const dt = DateTime.fromJSDate(date, {
    zone: 'utc',
  });

  return (format === 'iso')
    ? dt.toISO()
    : dt.toFormat(String(format));
}, {cacheKey: arguments_ => arguments_});

/**
 * Luxon Date object to human "xyz ago" format.
 * @param date {*}
 * @return {string}
 */
export const dateToAgo = (date) => {
  if (typeof date === 'object' && typeof date.toRelative === 'function') {
    return date.toRelative();
  }

  return DateTime.fromJSDate(date, {
    zone: 'utc',
  }).toRelative();
}

/**
 * Universal slug filter strips unsafe chars from URLs. This will replace the default
 * slug filter provided by 11ty.
 *
 * @see https://michaelharley.net/posts/2023/09/27/how-to-add-a-custom-slugify-filter-to-11ty/
 * @param string {string}
 * @returns {string}
 */
export const slugify = (string) => slugifyFn(string, {
  lower: true,
  replacement: '-',
  remove: /[&,+()$~%.'":*?!<>{}#/]/g,
});

/**
 * Takes a list of slugs and returns them converted to title case.
 *
 * @param list {Array<string>}
 * @return array {Array<{slug:string, title:string}>}
 */
export const formatSlugList = (list) => {
  return list.map((slug) => {
    return {
      slug,
      title: toTitleCase(slug)
    }
  })
};

export const findBySlug = (collection, slug) => {
  return (!slug)
    ? collection
    : collection.find((item) => item.slug === slug);
};

export const values = (obj, key) => obj[key];

export const randomItems = (arr, count) => {
  if (!Array.isArray(arr)) throw new Error('arr must be array');
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

/**
 * Returns list filtered to only include items where key matches value. This supports
 * wildcards for example value='type/*'.
 *
 * @param {Array<any>} collection
 * @param {String} key
 * @param {String|boolean|Array<String>}value
 * @return {Array<any>}
 */
export const whereKeyEquals = (collection, key, value) =>
  Array.isArray(value)
    ? collection.filter(item => value.includes(item[key]) || (item.data && value.includes(item.data[key])))
    : collection.filter(item => {
      if (typeof value === 'string' && value.includes('/*')) {
        return item[key].startsWith(`${value.split('/')[0]}/`);
      }
      return item[key] === value || (item.data && item.data[key] === value);
    });

export const whereKeyFalse = (collection, key) => collection.filter(item => item[key] === false || typeof item[key] === 'undefined');

/**
 * Find and return a list item based upon its fileSlug. This is used when looking up
 * bookwyrm book data as I name the review files as the open library key.
 *
 * @param {Array<any>} collection
 * @param {String} value
 * @return {any|undefined}
 */
export const findByFileSlug = (collection, value) => {
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
export const isSpecialTag = (tag) => tag.includes('/');

/**
 * Takes a special tag and returns its meta-data.
 *
 * @param list {string}
 * @return {{title?: string, description?: string, name: string, slug: string, permalink: string, url?: string }}
 */
export const specialTagMeta = (list) => {
  const idx = list.lastIndexOf('/');
  const name = list.substring(idx + 1);
  const slug = slugify(name);
  const meta = specialTagData[list] ?? {title: name, description: ''};
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
 * @param topics {Array<any>}
 * @returns {Array<{title: string, description: string, slug:string, url: string}>}
 */
export const formatTagList = (list, topics = []) => {
  return (list)
    ? topics.filter(({topic}) => list.includes(topic))
    : [];
};

/**
 * This returns the value of the first tag found matching key.
 * @param {Array<string>} tags
 * @param {string} key
 * @return {string|false}
 */
export const specialTagValue = memoize((tags, key) => {
  if (!Array.isArray(tags)) return false;

  for (const tag of tags) {
    if (tag.includes(`${key}/`)) {
      return tag.split('/')[1];
    }
  }

  return false;
}, {cacheKey: arguments_ => `${Array.isArray(arguments_[0]) ? arguments_[0].join(',') : 'undefined'}_${arguments_[1]}`});

/**
 * Takes a list and returns the limit number of items.
 *
 * @param array {Array<any>}
 * @param limit {number}
 * @returns {Array<any>}
 */
export const limit = (array, limit) => array.slice(0, limit);

/**
 * Surfaces the includes array method as a nunjucks filter.
 * @param {Array<any>} array
 * @param {String} searchElement
 * @return {boolean}
 */
export const includes = (array, searchElement) => Array.isArray(array) && array.includes(searchElement);

export const excludeStubs = (collection) => collection.filter(item => item.data.growthStage && item.data.growthStage !== 'stub');

export const excludeType = (collection, type) => {
  return (!type)
    ? collection
    : collection.filter(item => item.data.contentType !== type);
};

export const excludeTypes = (collection, types = []) => (
  types.length > 0
    ? collection.filter(item => types.includes(item.data.contentType) === false)
    : collection
);

export const onlyGrowthStages = (collection, stages) => {
  if (!Array.isArray(stages)) stages = [stages];
  return collection.filter(item => stages.includes(item.data.growthStage ?? 'unknown'));
}

export const onlyTypes = (collection, types = []) => (
  types.length > 0
    ? collection.filter(item => types.includes(item.data.contentType))
    : collection
);

export const onlyType = (collection, type) => {
  return (!type)
    ? collection
    : collection.filter(item => item.data.contentType === type);
};

export const withoutFeatured = (collection) => collection.filter(item => {
  return !item.data.featured
});

export const onlyFeatured = (collection) => collection.filter(item => {
  return item.data.featured && item.data.featured === true;
});

export const debug = (...args) => {
  console.log(...args)
  debugger;
};

export const ogImageFromSlug = (slug) => {
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
export const includesTag = memoize(
  (tags, slug) => tags.find(tag => tag.toLowerCase() === slug.toLowerCase()) !== undefined,
  {cacheKey: arguments_ => `${arguments_[0].join(',')}_${arguments_[1]}`}
);

/**
 * Check if a given tag list contains a special tag.
 *
 * @param tags {Array<string>}
 * @param slug {string}
 * @returns {boolean}
 */
export const includesSpecialTag = memoize(
  (tags, slug) => tags.find(tag => tag.toLowerCase().startsWith(slug.toLowerCase())) !== undefined,
  {cacheKey: arguments_ => `${arguments_[0].join(',')}_${arguments_[1]}`}
)

/**
 * Excludes special tags matching key. If key is empty then it excludes all special tags.
 *
 * @param {Array<String>} tags
 * @param {Array<String>|String} keys
 * @returns {Array<String>}
 */
export const excludeSpecialTags = (tags, keys = []) => {
  if (!Array.isArray(keys)) keys = [keys];
  const n = tags.filter(tag => tag.includes('/') === false);
  if (keys.length === 0) return tags.filter(tag => tag.includes('/') === false);

  return tags.filter(tag => {
    if (!tag.includes('/')) return true;
    for (const key of keys) {
      if (tag.startsWith(`${key}/`)) return false;
    }
    return true;
  });
};

/**
 * @param {Array<string>} tags
 * @param {Array<string>|string} excluding
 */
export const withoutTags = (tags, excluding) => {
  const arrSet = new Set((Array.isArray(excluding) ? excluding : [excluding]).map(item => item.toLowerCase()));
  return tags.filter(item => arrSet.has(item.toLowerCase()) === false);
};

/**
 * Filters collection of pages, returning a collection of those tagged with one or more tags in `onlyTags`
 * @param {*} collection
 * @param {Array<string>|string} onlyTags
 * @return {Array<*>}
 */
export const onlyTagged = (collection, onlyTags) => {
  if (!Array.isArray(collection) || collection.length === 0) return [];
  const tags = new Set((typeof onlyTags === 'string') ? [onlyTags] : onlyTags);
  return collection.filter((item) => (item.data?.tags ?? []).some(tag => tags.has(tag)));
}

/**
 * Filters collection of pages, returning a collection of pages that are not tagged with one or more tags in `excludedTags`
 * @param {*} collection
 * @param {Array<string>|string} excludedTags
 * @return {Array<*>}
 */
export const notTagged = (collection, excludedTags) => {
  if (!Array.isArray(collection) || collection.length === 0) return [];
  const excluded = new Set((typeof excludedTags === 'string') ? [excludedTags] : excludedTags);
  return collection.filter((item) => (item.data?.tags ?? []).some(tag => excluded.has(tag)) === false);
}

/**
 * This function reduces a collection into a list of topics sorted by most to least used. To reduce
 * complexity this makes use of 11tys built in creation of collections by tag.
 *
 * NOTE: This function excludes all tags containing a /.
 *
 * @param {Array<*>} collections input collection
 * @param {Array<string>} exclude tags to exclude from list
 * @param {Array<string>} filter filter items from usages with matching tags
 * @return {Array<{name: string, usages: Number}>}
 */
export const tagsInCollection = (collections, exclude = [], filter = []) => {
  const tags = [];
  const filtered = new Set(filter);
  for (const tag in collections) {
    if (tag === 'all' || exclude.includes(tag) || tag.includes('/')) continue;

    tags.push({
      name: tag,
      usages: collections[tag].filter((item) => (item.data?.tags ?? []).some(tag => filtered.has(tag)) === false).length,
    });
  }

  return tags
    .filter(item => item.usages > 0)
    .sort((a,b) => b.usages - a.usages);
}

/**
 * While tagsInCollection excludes tags including a forward slash, this function only deals with
 * those special tags.
 *
 * @param {Array<*>} collections input collection
 * @param {String} tag
 * @param {Array<string>} filter filter items from usages with matching tags
 * @return {Array<{name: string, usages: Number}>}
 */
export const specialTagsInCollection = (collections, tag, filter = []) => {
  return Array.from(groupBySpecialTag(collections, tag, filter).values())
    .filter(item => item.usages > 0)
    .sort((a, b) => b.usages - a.usages);
}

/**
 * Group a collection by year.
 *
 * @param {Array<any>} collection
 * @returns {Map<number, Array<any>>}
 */
export const groupByYear = (collection) => collection.reduce((carry, post) => {
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
export const groupByMonth = (collection) => collection.reduce((carry, post) => {
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
export const groupByKey = (collection, key) => collection.reduce((carry, item) => {
  const value = Object.hasOwn(item, 'data')
    ? (item.data[key] ?? 'unknown')
    : item[key] ?? 'unknown';

  const group = carry.get(value) ?? [];
  group.push(item);
  carry.set(value, group);
  return carry;
}, new Map());

/**
 *
 * @param {Array<any>} collections input collection
 * @param {String} tag
 * @param {Array<String>} filter filter items from usages with matching tags
 * @return {Map<string, {name: string, items: Array<any>, usages: Number}>}
 */
export const groupBySpecialTag = (collections, tag, filter = []) => {
  const filtered = new Set(Array.isArray(filter) ? filter : [filter]);
  return Object.keys(collections)
    .filter(item => item.startsWith(`${tag}/`))
    .reduce((carry, collection) => {
      const name = collection.split('/')[1];
      const items = collections[collection].filter((item) => (item.data?.tags ?? []).some(tag => filtered.has(tag)) === false);
      const data = specialTagData[collection] ?? {};

        carry.set(name, {
        ...data,
        name,
        items,
        usages: items.length,
      });

      return carry;
    }, new Map());
};

/**
 * Extracts the footnotes html from a page content so that it my be output
 * elsewhere on the page. This is because I want to place the footnotes
 * inside the <footer> tag of my <article> instead of it being a part
 * of the main body text.
 *
 * @param {string|undefined} html
 * @return {string|undefined}
 */
export const extractFootnotes = (html) => {
  if (!html) return html;
  const root = parse(html);
  const footnotes = root.querySelector('section.footnotes');

  return (footnotes) ? footnotes.toString() : undefined;
};

/**
 * Filters the footnotes html from a page content.
 * @param {string|undefined}html
 * @return {string|undefined}
 */
export const withoutFootnotes = (html) => {
  if (!html) return html;
  const root = parse(html);
  const footnotes = root.querySelector('section.footnotes');

  if (!footnotes) return html;
  root.removeChild(footnotes);
  return root.toString();
}

export const extractMarkedAbstractContent = (html) => {
  if (typeof html !== 'string') return undefined;
  const root = parse(html);
  const abstract = root.querySelector('.abstract');

  return (abstract) ? abstract.innerHTML.toString() : undefined;
}

export const withoutMarkedAbstractContent = (html) => {
  if (typeof html !== 'string') return html;
  const root = parse(html);
  const abstract = root.querySelector('.abstract');

  if (!abstract) return html;
  root.removeChild(abstract);
  return root.toString();
}

/**
 * Left String Padding
 * @param {string} str
 * @param {number} len
 * @param {string} filler
 * @return {string}
 */
export const padStart = (str, len, filler) => String(str).padStart(len, filler);

export const ratingToStars = (rating, max = 5) => {
  if (rating > max) rating = max;
  return '★'.repeat(rating).concat(Math.ceil(rating) !== rating ? '½' : '');
};

export const seriesPosts = (collection, name) => {
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

export const isArray = (arr) => Array.isArray(arr);

export const chunkArray = (arr, max = 8) => arr.reduce((carry, item) => {
  if (carry.length === 0) {
    carry.push([item]);
    return carry;
  }

  if (carry[carry.length-1].length + 1 > max) {
    carry.push([item]);
    return carry;
  }

  carry[carry.length-1].push(item);
  return carry;
}, []);

/**
 * Takes a 11ty collection and returns a stats object for presentation
 * TODO: turn this into a 11ty plugin...
 */
export const collectionStats = (collection) => {
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
 * Filter collection by posts only posted within the Monday to Sunday of a given week for a given year.
 * @param {*} collection
 * @param {Number|string} week
 * @param {Number|string} year
 */
export const inWeek = (collection, week, year) => {
  if (typeof week === 'undefined' || typeof year === 'undefined') throw new Error('inWeek requires both week and year values are set');
  const dates = new Set();
  const startDate = DateTime.fromFormat(`${year} ${week}`, 'kkkk W');

  dates.add(startDate.toFormat('yyyy-LL-dd'));

  for (let days = 1; days <= 6; days++) {
    dates.add(startDate.plus({days}).toFormat('yyyy-LL-dd'));
  }

  return collection.filter((item) => dates.has(dateToFormat(item.date, 'yyyy-LL-dd')));
}

/**
 * Takes a list of names or pages and returns a map with them sorted into A-Z + #, ? buckets.
 *
 * @see https://github.com/benjifs/benji/blob/65e82aade03efde17cb04c31ce4f13d59dbfeff3/.eleventy.js#L71-L85
 * @param collection
 * @returns {Map<any, any>}
 */
export const alphabetSort = (collection) => {
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

export const json = (object) => JSON.stringify(object);

export const joinList = (list) => {
  if (!Array.isArray(list)) return list;

  const items = [...list];

  const last = items.pop();
  const remaining = items.length > 1
    ? items.join(', ')
    : items.pop();
  return `${remaining} and ${last}`;
};

/**
 * Returns an excerpt from a page, either defined from its front matter or generated
 * from the first paragraph of text. Always returned wrapped in <p> tags.
 * @param {*} page
 * @return {string}
 */
export const excerpt = (page) => {
  if (page.data.excerpt) return `<p>${page.data.excerpt}</p>`;

  const regex = /<p>(.*?)<\/p>/;
  const paragraphs = regex.exec(page.content);

  // The first array element will include the `<p>` tags, the second without.
  return (paragraphs) ? paragraphs[1] : "";
}

/**
 * Passes through the linked collection of pages after mutating each pages backlinks data array to include the
 * linkedFrom page, if not already there.
 *
 * @param {*} linkedFrom
 * @param {*} linked
 * @param {string|undefined} title
 * @return {*}
 */
export const trackBacklink = (linked, linkedFrom, title = undefined) => {
  // TODO: Should also add linked to linkedFrom.data.outboundLinks

  if (!linkedFrom?.data?.title && typeof title === 'undefined') return linked;

  const linkedFromTitle = linkedFrom?.data?.title ?? title;

  return linked.map((page) => {
    if (!page.data.backlinks) page.data.backlinks = [];
    if (page.data.backlinks.findIndex((backlink => backlink.url === linkedFrom.url)) === -1) {
      page.data.backlinks.push({
        url: linkedFrom.url,
        title: linkedFromTitle,
      });
    }
    return page;
  });
}

/**
 * Takes a list of "folders" and converts them into a breadcrumb link list.
 * @param {Array<string|{href:string, text: string, title: string}>} folders
 * @return {Array<{href:string, text: string, title: string}>}
 */
export const breadcrumbs = (folders = []) => {
  const defaultCrumbs = [{href: '/', text: '~', title: 'Back to homepage'}];
  if (!Array.isArray(folders)) return defaultCrumbs;

  if (folders.includes('project')) folders = folders.filter(folder => folder !== 'writing');

  return folders.reduce((crumbs, folder) => {
    if (typeof folder === 'string') {
      switch (folder) {
        case 'about':
          crumbs.push({href: '/about/', text: 'about', title: 'Goto About page'});
          break;
        case 'types':
          crumbs.push({href: '/about/content/', text: 'types', title: 'Goto Content Types info page'});
          break;
        case 'writing':
          crumbs.push({href: '/writing/', text: 'writing', title: 'Goto Archive of all posts'});
          break;
        case 'glossary':
          crumbs.push({href: '/glossary/', text: 'glossary', title: 'View all Glossary terms'});
          break;
        case 'changelog':
          crumbs.push({href: '/changelog/', text: 'changelog', title: 'View changelog'});
          break;
        case 'essays':
          crumbs.push({href: '/essays/', text: 'essays', title: 'View all Essays'});
          break;
        case 'noteworthy':
          crumbs.push({href: '/noteworthy/', text: 'noteworthy', title: 'View all Noteworthy notes'});
          break;
        case 'tutorials':
          crumbs.push({href: '/tutorials/', text: 'tutorials', title: 'View all Tutorials'});
          break;
        case 'thoughts':
          crumbs.push({href: '/thoughts/', text: 'thoughts', title: 'View all thoughts'});
          break;
        case 'graph':
          crumbs.push({href: '/writing/graph/', text: 'graph', title: 'Connection graph view of all posts'});
          break;
        case 'topic':
          crumbs.push({href: '/topic/', text: 'topics', title: 'Goto list of all topics'});
          break;
        case 'resource':
          crumbs.push({href: '/resources/', text: 'resources', title: 'Goto Archive of all resources'});
          break;
        case 'project':
          crumbs.push({href: '/projects/', text: 'projects', title: 'Visit My Projects'})
          break;
        case 'lists':
          crumbs.push({href: '/lists/', text: 'lists', title: 'Goto Archive of all lists'});
          break;
        case 'stats':
          crumbs.push({href: '/stats/', text: 'stats', title: 'Goto writing stats'});
          break;
      }
    } else {
      crumbs.push(folder);
    }

    return crumbs;
  }, defaultCrumbs);
}

//////////////////////////////////////////////////////////////////
// Image Colour Filter & Supporting Functions
//

/**
 * Sourced from Thomas Park's iTunes Expanding Album Effect (2012)
 * @see https://24ways.org/2010/calculating-color-contrast
 * @param color {Array<number>}
 * @return {number}
 */
function getContrastYIQ(color) {
  const r = color[0],
    g = color[1],
    b = color[2];

  return ((r*299)+(g*587)+(b*114))/1000;
}

/**
 * Sourced from Thomas Park's iTunes Expanding Album Effect (2012)
 * @param yiq {number}
 * @return {Array<number>}
 */
function getDefaultColor(yiq){
  return (yiq >= 128) ? [0, 0, 0] : [255, 255, 255];
}

/**
 * Sourced from Thomas Park's iTunes Expanding Album Effect (2012)
 * @see https://thomaspark.co/2012/12/the-itunes-expanding-album-effect-in-css-js/
 * @param color
 * @param palette
 * @return {{primary: Array<number>, secondary: Array<number>}}
 */
function inverseColors(color, palette) {
  const yiq = getContrastYIQ(color);
  let colors = [],
    primary,
    secondary;

  for (let i = 0; i < palette.length; i++) {
    if (Math.abs(getContrastYIQ(palette[i]) - yiq) > 80) {
      colors.push(palette[i]);
    }
  }

  primary = colors[0] ? colors[0] : getDefaultColor(yiq);
  secondary = colors[1] ? colors[1] : getDefaultColor(yiq);

  return {primary, secondary};
}

/**
 * Uses Colour Thief library to return a colour palette generated from
 * an image source.
 * @param src {string}
 * @param numColours {number}
 * @return {Promise<{primary: Array, palette: Array}>}
 */
const imgColours = async (src, numColours = 5) => {
  const img = path.join(process.cwd(), 'public', src);

  const primary = await ColorThief.getColor(img);
  const palette = await ColorThief.getPalette(img, numColours);

  return {
    primary,
    palette,
    inverse: inverseColors(primary, palette),
  }
};

/**
 * Returns index position of page in collection, or -1 if not found.
 * @param collection {Array}
 * @param page {Object}
 * @return {number}
 */
const ixdInCollection = (collection, page) => collection.findIndex((el) => el.url === page.url);

/**
 * Return
 * @param arr {Array}
 * @param idx {number}
 * @param limit {number}
 */
const neighbours = (arr, idx, limit) => {
  if (arr.length <= limit) return arr;

  const bits = [];
  let start = idx - limit;
  let end = (2* limit) - 1 + start;

  if (end > arr.length - 1) {
    const tmp = end;
    end = arr.length - 1;
    start -= tmp - end;
  } else if (start < 0) {
    const tmp = Math.abs(start);
    start = 0;
    end += tmp;
  }

  for (let i = start; i <= end; i++) {
    bits.push(arr[i]);
  }

  return bits;
}

/**
 * Registers filters
 * @todo document usage of each filter
 * @todo remove any obsolete filters above that are not registered or otherwise imported elsewhere
 * @param eleventyConfig
 */
export const registerFilters = (eleventyConfig) => {
  eleventyConfig.addFilter('whereKeyEquals', whereKeyEquals);
  eleventyConfig.addFilter('findByFileSlug', findByFileSlug);
  eleventyConfig.addFilter('dateToFormat', dateToFormat);
  eleventyConfig.addFilter('dateToAgo', dateToAgo);
  eleventyConfig.addFilter('extractFootnotes', extractFootnotes);
  eleventyConfig.addFilter('withoutFootnotes', withoutFootnotes);
  eleventyConfig.addFilter('padStart', padStart);
  eleventyConfig.addFilter('specialTagValue', specialTagValue);
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('includes', includes);
  eleventyConfig.addFilter('alphabetSort', alphabetSort);
  eleventyConfig.addFilter('onlyTagged', onlyTagged);
  eleventyConfig.addFilter('notTagged', notTagged);
  eleventyConfig.addFilter('groupByYear', groupByYear);
  eleventyConfig.addFilter('groupByMonth', groupByMonth);
  eleventyConfig.addFilter('groupBySpecialTag', groupBySpecialTag);
  // Used by lists.njk
  eleventyConfig.addFilter('groupByKey', groupByKey);
  eleventyConfig.addFilter('breadcrumbs', breadcrumbs);
  eleventyConfig.addFilter('tagsInCollection', tagsInCollection);
  eleventyConfig.addFilter('ratingToStars', ratingToStars);
  eleventyConfig.addFilter('specialTagsInCollection', specialTagsInCollection);
  eleventyConfig.addFilter('joinList', joinList);
  eleventyConfig.addAsyncFilter('imgColours', imgColours);
  eleventyConfig.addFilter('collectionStats', collectionStats);
  eleventyConfig.addFilter('isArray', isArray);
  eleventyConfig.addFilter('values', values);

  // Used by tag-list.njk
  eleventyConfig.addFilter('formatTagList', formatTagList);
  eleventyConfig.addFilter('excludeSpecialTags', excludeSpecialTags);
  eleventyConfig.addFilter('withoutTags', withoutTags);

  // Used for displaying 88x31 buttons
  eleventyConfig.addFilter('randomItems', randomItems);
  eleventyConfig.addFilter('firstBtn', firstBtn);

  // This replaces the internal 11ty slugify filter
  eleventyConfig.addFilter('slugify', slugify);

  // These are used by week-in-review-links.njk
  eleventyConfig.addFilter('inWeek', inWeek);
  eleventyConfig.addFilter('trackBacklink', trackBacklink);
  eleventyConfig.addFilter('includesTag', includesTag);
  eleventyConfig.addFilter('excerpt', excerpt);

  // This is used by page.njk for displaying the series sidebar component
  eleventyConfig.addFilter('includesSpecialTag', includesSpecialTag);
  eleventyConfig.addFilter('ixdInCollection', ixdInCollection);
  eleventyConfig.addFilter('neighbours', neighbours);

  eleventyConfig.addFilter('extractMarkedAbstractContent', extractMarkedAbstractContent);
  eleventyConfig.addFilter('withoutMarkedAbstractContent', withoutMarkedAbstractContent);

  // Used for debugging
  eleventyConfig.addFilter('debug', debug);
  eleventyConfig.addFilter('json', json);

  // Used to ensure TOC plugin includes a link to the footer section
  eleventyConfig.addFilter('withBacklinksHeader', (html) => {
    return `${html}<h2 id="backlinks">Pages Linking Here <a class="header-anchor" href="#backlinks">¶</a></h2>`
  });

  eleventyConfig.addFilter('withHeadings', (html, headings = []) => {
    if (!Array.isArray(headings)) return html;

    return headings.reduce((carry, heading) => {
      return `${carry}<h2 id="${heading.id}">${heading.text} <a class="header-anchor" href="#${heading.id}">¶</a></h2>`;
    }, html);
  });
};
