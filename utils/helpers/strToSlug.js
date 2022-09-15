const slugify = require('slugify');

module.exports = (string) => slugify(string, {
  lower: true,
  replacement: '-',
  remove: /[&,+()$~%.'":*?!<>{}#/]/g,
});