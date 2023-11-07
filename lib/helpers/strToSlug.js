const slugify = require('slugify');

/**
 * @param string {string}
 * @returns {string}
 */
module.exports = (string) => slugify(string, {
  lower: true,
  replacement: '-',
  remove: /[&,+()$~%.'":*?!<>{}#/]/g,
});