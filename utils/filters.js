const slugify = require('slugify')
const { DateTime } = require('luxon')

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
            remove: /[&,+()$~%.'":*?<>{}]/g,
        })
    },
}