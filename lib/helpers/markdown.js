import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItFootnote from 'markdown-it-footnote';
import MarkdownItTaskLists from 'markdown-it-task-lists';
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'
import MarkdownItAttributes from 'markdown-it-attrs';
import MarkdownItFigures from 'markdown-it-image-figures';
// TODO move file to ../lib

let markdown = undefined;

export default () => {
  if (typeof markdown !== 'undefined') return markdown;
  markdown = MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });

  /**
   * Adds support for adding attributes to elements with curly braces, e.g:
   * {.class #identifier attr=value attr2="spaced value"}
   *
   * @see https://www.npmjs.com/package/markdown-it-attrs
   */
  markdown.use(MarkdownItAttributes);


  /**
   * Adds `<figure>` wrapper for images, using the title as figcaption content.
   * This plugin supports usage of Markdown syntax within the figcaption.
   *
   * @see https://www.npmjs.com/package/markdown-it-image-figures
   */
  markdown.use(MarkdownItFigures, {
    figcaption: 'title',
  });

  /**
   * Adds support for GitHub alert syntax e.g:
   * > [!NOTE]
   * > Highlights information that users should take into account
   *
   * @see https://www.npmjs.com/package/markdown-it-github-alerts
   */
  markdown.use(MarkdownItGitHubAlerts);

  /**
   * Adds an id attribute to headings
   *
   * @see https://www.npmjs.com/package/markdown-it-anchor
   */
  markdown.use(MarkdownItAnchor, {
    permalink: true,
  });

  /**
   * Parses footnotes in [^1] format based on the pandoc definition.
   *
   * @see https://www.npmjs.com/package/markdown-it-footnote
   */
  markdown.use(MarkdownItFootnote);

  /**
   * Converts lists prefixed with [ ] or [x] into HTML checkboxes in the same way
   * that GitHub does.
   *
   * @see https://www.npmjs.com/package/markdown-it-task-lists
   */
  markdown.use(MarkdownItTaskLists, {
    label: true,
  });

  markdown.renderer.rules.footnote_block_open = () => (
    '<section id="footnotes">\n' +
    '<h3>Footnotes <a class="header-anchor" href="#footnotes">¶</a></h3>\n' +
    '<ol class="footnotes-list">\n'
  );

  return markdown;
}
