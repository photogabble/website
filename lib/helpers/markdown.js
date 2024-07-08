import markdownit from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTaskLists from 'markdown-it-task-lists';
// TODO move file to ../lib

let markdown = undefined;

export default () => {
  if (typeof markdown !== 'undefined') return markdown;
  markdown = markdownit({
    html: true,
    breaks: true,
    linkify: true,
  });

  markdown.use(markdownItAnchor, {
    permalink: false,
  });

  markdown.use(markdownItFootnote);

  markdown.use(markdownItTaskLists, {
    label: true,
  });

  markdown.renderer.rules.footnote_block_open = () => (
    '<section id="footnotes">\n' +
    '<h3>Footnotes</h3>\n' +
    '<ol class="footnotes-list">\n'
  );

  return markdown;
}
