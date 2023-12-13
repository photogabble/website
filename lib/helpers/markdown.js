const {slugify} = require("../filters");
const {setupMarkdownIt} = require("./hashtags");

const markdown = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
});

markdown.use(require("markdown-it-anchor"), {
  permalink: false,
  slugify: input => slugify(input),
});

markdown.use(require("markdown-it-footnote"));

// TODO: Move hashtags to plugin...
setupMarkdownIt(markdown);

module.exports = markdown;