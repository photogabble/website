import markdownit from 'markdown-it'
import markdown from './markdown.js';
import markdownItHashtag from 'markdown-it-hashtag';

export default (eleventyConfig, config) => {
  const slugify = eleventyConfig.getFilter('slugify');
  const dictionary = config.dictionary ?? [];
  // TODO: use dictionary to map hashTag to topic (e.g GameDev -> Game Development)

  // Written for #162, this provides hashtag linking and programmatic of post tags.
  // @see https://github.com/photogabble/website/issues/162
  const setupMarkdownIt = (md) => {
    md.use(markdownItHashtag, {
      hashtagRegExp: '(?!\\d+\\b)\\w{3,}',
    });

    md.renderer.rules.hashtag_open = (tokens, idx) => `<a href="/topic/${slugify(tokens[idx].content)}" class="tag">`;

    return md;
  };

  const md = setupMarkdownIt(markdownit());
  setupMarkdownIt(markdown());

  eleventyConfig.addGlobalData('eleventyComputed.tags', () => {
    return async (data) => {
      const tags = new Set((data.tags && Array.isArray(data.tags)) ? data.tags : []);

      if (!data.hashtagsMapped && data.page.templateSyntax.split(',').includes('md')) {
        const content = data.page.rawInput;

        // Only do the expensive markdown parse if content contains potential hashtags
        if (content && content.match(/#([\w-]+)/g)) {
          const tokens = md.parseInline(content, {});
          for (const token of tokens) {
            for (const child of token.children) {
              if (child.type === 'hashtag_text') tags.add(child.content);
            }
          }
        }

        data.hashtagsMapped = true;
      }
      return Array.from(tags);
    };
  });
};
