// Written for #162, this provides hashtag linking and programmatic of post tags.
// @see https://github.com/photogabble/website/issues/162
module.exports = {
  setupMarkdownIt: (md) => {
    md.use(require('markdown-it-hashtag'), {
      hashtagRegExp: '(?!\\d+\\b)\\w{3,}',
    })

    md.renderer.rules.hashtag_open = (tokens, idx) => `<a href="/topic/${tokens[idx].content.toLowerCase()}" class="tag">`;

    return md;
  },

  parseCollectionHashtags: (md) => (item) => {
    if (!item.data.hashtagsMapped) {
      // Identify Hashtags and append to Tags
      const tags = new Set(item.data.tags ?? []);
      const found = new Set();
      const content = item.template?.frontMatter?.content;

      // Only do the expensive markdown parse if content contains potential hashtags
      if (content && content.match(/#([\w-]+)/g)) {
        const tokens = md.parseInline(content, {});
        for (const token of tokens) {
          for (const child of token.children) {
            if (child.type === 'hashtag_text') found.add(child.content);
          }
        }

        if (found.size > 0) {
          found.forEach(tag => {
            tags.add(tag);
          });

          item.data.tags = Array.from(tags);
        }
      }
      // Mark this post as processed, so we don't do so again each time this collection is requested
      item.data.hashtagsMapped = true;
    }

    return item;
  }
};