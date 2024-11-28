import slugify from 'slugify';

/**
 * @param string {string}
 * @returns {string}
 * @todo this can likely be removed in preference of slug function in filters.js
 */
export default (string) => slugify(string, {
  lower: true,
  replacement: '-',
  remove: /[&,+()$~%.'":*?!<>{}#/]/g,
});
