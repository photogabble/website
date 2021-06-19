const slugify = require('slugify')
const { DateTime } = require('luxon')
const { toTitleCase } = require('./helpers');

module.exports = {
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
     * when working with old /yyyy/MM/dd/slug format from Wordpress exports.
     */
    dateToFormat: (date, format) => {
        return DateTime.fromJSDate(date, {
            zone: 'utc',
        }).toFormat(String(format))
    },

    /**
     * Universal slug filter strips unsafe chars from URLs
     */
    slugify: (string) => {
        return slugify(string, {
            lower: true,
            replacement: '-',
            remove: /[&,+()$~%.'":*?!<>{}]/g,
        })
    },

    /**
     * Takes a list of slugs and returns them converted to title case.
     * @param list
     * @return array
     */
    formatSlugList: (list) => {
        return list.map((slug) => {
            return {
                slug,
                title: toTitleCase(slug)
            }
        })
    },

    /**
     * Takes a list and returns the limit number of items.
     */
    limit: (array, limit) => array.slice(0, limit),

    excludeCategory: (collection, category) => {
        if (!category) return collection;
        return collection.filter(item => {
            if (!item.data.categories){
                return false;
            }
            return !item.data.categories.includes(category);
        })
    },

    onlyCategory: (collection, category) => {
        if (!category) return collection;
        return collection.filter(item => {
            if (!item.data.categories){
                return false;
            }
            return item.data.categories.includes(category);
        })
    },
}
