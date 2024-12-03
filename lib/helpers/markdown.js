import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItTaskLists from 'markdown-it-task-lists';
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
// TODO move file to ../lib

let markdown = undefined;

export default () => {
  if (typeof markdown !== 'undefined') return markdown;
  markdown = MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });

  markdown.use(MarkdownItGitHubAlerts, /* Options */)

  markdown.use(MarkdownItAnchor, {
    permalink: false,
  });

  markdown.use(MarkdownItFootnote);

  markdown.use(MarkdownItTaskLists, {
    label: true,
  });

  markdown.renderer.rules.footnote_block_open = () => (
    '<section id="footnotes">\n' +
    '<h3>Footnotes</h3>\n' +
    '<ol class="footnotes-list">\n'
  );

  return markdown;
}
