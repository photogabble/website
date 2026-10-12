import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItGitHubAlerts from 'markdown-it-github-alerts'
import markdownItAttributes from 'markdown-it-attrs';
import markdownItFigures from 'markdown-it-image-figures';
import markdownItContainer from 'markdown-it-container';

/**
 * Content containers, example usage:
 * `::: abstract Some text :::`
 */
const containers = ['abstract', 'note', 'info', 'warning', 'aside'];

// Global cached state so we don't reload markdownIt more than once.
let markdown = undefined;

export default () => {
  if (typeof markdown !== 'undefined') return markdown;

  markdown = markdownIt({
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
  markdown.use(markdownItAttributes);


  /**
   * Adds `<figure>` wrapper for images, using the title as figcaption content.
   * This plugin supports usage of Markdown syntax within the figcaption.
   *
   * @see https://www.npmjs.com/package/markdown-it-image-figures
   */
  markdown.use(markdownItFigures, {
    figcaption: 'title',
  });

  /**
   * Adds support for GitHub alert syntax e.g:
   * > [!NOTE]
   * > Highlights information that users should take into account
   *
   * @see https://www.npmjs.com/package/markdown-it-github-alerts
   */
  markdown.use(markdownItGitHubAlerts);

  /**
   * Adds an id attribute to headings
   *
   * @see https://www.npmjs.com/package/markdown-it-anchor
   */
  markdown.use(markdownItAnchor, {
    permalink: true,
  });

  /**
   * Parses footnotes in [^1] format based on the pandoc definition.
   *
   * @see https://www.npmjs.com/package/markdown-it-footnote
   */
  markdown.use(markdownItFootnote);

  /**
   * Parses sections, I am using this to wrap content that I want to pull out of the main body and display in
   * the pages abstract section.
   *
   * @see https://github.com/markdown-it/markdown-it-container
   */
  for(const name of containers) {
    markdown.use(markdownItContainer, name, {
      render: (tokens, idx) => tokens[idx].nesting === 1
        ? `<aside class="callout callout--${name}"><p class="callout__label">${name}</p>\n`
        : '</aside\n>',
    });
  }

  /**
   * Converts lists prefixed with [ ] or [x] into HTML checkboxes in the same way
   * that GitHub does.
   *
   * @see https://www.npmjs.com/package/markdown-it-task-lists
   */
  markdown.use(markdownItTaskLists, {
    label: true,
  });

  markdown.renderer.rules.footnote_block_open = () => (
    '<section class="footnotes">\n' +
    '<h2 id="footnotes">Footnotes <a class="header-anchor" href="#footnotes">¶</a></h2>\n' +
    '<ol class="footnotes-list">\n'
  );

  return markdown;
}
