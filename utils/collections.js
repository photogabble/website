const {chunk} = require('./helpers')
const {slugify} = require("./filters");

// Regex to find all hashtags in a string: #(...)
const hashtagRegExp = /#([\w-]+)/g

// Written with inspiration from:
// @see https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
const paginateContentTaxonomy = (baseSlug = '', perPage = 10) => {
  return (pages, taxonomy) => {
    const slugs = [];
    const chunks = chunk(taxonomy.items, perPage);
    chunks.forEach((content, idx) => {
      slugs.push(idx > 0
        ? `${baseSlug}${taxonomy.slug}/${idx + 1}`
        : `${baseSlug}${taxonomy.slug}`)
    });
    const totalPages = slugs.length;
    chunks.forEach((items, idx) => {
      pages.push({
        title: taxonomy.name,
        slug: slugs[idx],
        pageNumber: idx + 1,
        totalPages,
        pageSlugs: {
          all: slugs,
          next: slugs[idx + 1] || null,
          previous: slugs[idx - 1] || null,
          first: slugs[0] || null,
          last: slugs[slugs.length - 1] || null
        },
        items
      })
    });
    return pages;
  };
};

const md = require('markdown-it')();
md.inline.ruler.after('text', 'hashtag', function replace(state) {
  const tokens = state.tokens;
  const Token = state.Token;

  for (let i = tokens.length - 1; i >= 0; i--) {
    const currentToken = tokens[i];

    // Skip content of markdown links
    if (currentToken.type === 'link_close') {
      i--;
      while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
        i--;
      }
      continue;
    }

    if (currentToken.type === 'html_inline') throw new Error('How interesting...');

    if (currentToken.type !== 'text') continue;

    let text = currentToken.content;
    const matches = text.match(hashtagRegExp);

    if (matches === null) continue;

    const nodes = [];
    let level = currentToken.level;

    for (let m = 0; m < matches.length; m++) {
      const tagName = matches[m].split('#', 2)[1];

      if (tagName.length < 2) continue;

      // find the beginning of the matched text
      let pos = text.indexOf(matches[m]);

      // find the beginning of the hashtag
      pos = text.indexOf('#' + tagName, pos);

      let token;

      if (pos > 0) {
        token = new Token('text', '', 0);
        token.content = text.slice(0, pos);
        token.level = level;
        nodes.push(token);
      }

      token = new Token('hashtag_open', '', 1);
      token.content = tagName;
      token.level = level++;
      nodes.push(token);

      token = new Token('hashtag_text', '', 0);
      token.content = md.utils.escapeHtml(tagName);
      token.level = level;
      nodes.push(token);

      token = new Token('hashtag_close', '', -1);
      token.level = --level;
      nodes.push(token);

      text = text.slice(pos + 1 + tagName.length);
    }

    if (text.length > 0) {
      token = new Token('text', '', 0);
      token.content = text;
      token.level = level;
      nodes.push(token);
    }

    // Replace current node
    const result = md.utils.arrayReplaceAt(state.tokens, i, nodes);
    state.tokens = result;
  }
});

md.renderer.rules.hashtag_open  = (tokens, idx) => `<a href="/tags/${tokens[idx].content.toLowerCase()}" class="tag">`;
md.renderer.rules.hashtag_text  = (tokens, idx) => `#${tokens[idx].content}`;
md.renderer.rules.hashtag_close = () => '</a>';

// Filter draft posts when deployed into production
const post = (collection) => ((process.env.ELEVENTY_ENV !== 'production')
    ? [...collection.getFilteredByGlob('./content/**/*.md')]
    : [...collection.getFilteredByGlob('./content/**/*.md')].filter((post) => !post.data.draft)
).map(post => {
  // Identify Hashtags and append to Tags
  const tags = new Set(post.data.tags ?? []);
  let found = [];

  const content = post.template?.frontMatter?.content;

  // Only do the expensive markdown parse if content contains potential hashtags
  if (content && content.match(hashtagRegExp)) {
    const renderedTokens = md.parseInline(content, {});
    const n = 1;
  }


  // const hashtags = new Set(post.template?.frontMatter?.content?.match(hashtagRegExp) || []);
  //
  // hashtags.forEach(tag => {
  //   const found = tag.match(/#\(([\w-]+)\)/);
  //   if (found[1] === '...') return;
  //   tags.add(found[1]);
  // });
  //
  // post.data.tags = Array.from(tags);
  return post;
});

// Written for #20, this creates a collection of all tags
// @see https://github.com/photogabble/website/issues/20
const contentTags = (collection) => Array.from(
  post(collection).reduce((tags, post) => {
    if (post.data.tags) post.data.tags.forEach(tag => tags.add(tag));
    return tags;
  }, new Set())
).map(name => {
  return {
    name,
    slug: slugify(name),
    items: collection.getFilteredByTag(name).filter((item) => item.data.growthStage && item.data.growthStage !== 'stub').reverse()
  }
}).sort((a, b) => b.items.length - a.items.length);

const contentTypes = (collection) => Object.values(post(collection).reverse().reduce((types, post) => {
  if (post.data.growthStage && post.data.growthStage !== 'stub') types[post.data.contentType].items.push(post);
  return types;
}, {
  thought: {
    name: 'Thoughts',
    slug: 'thoughts',
    items: [],
  }, noteworthy: {
    name: 'Noteworthy',
    slug: 'noteworthy',
    items: []
  }, essay: {
    name: 'Essays',
    slug: 'essays',
    items: []
  }, tutorial: {
    name: 'Tutorials',
    slug: 'tutorials',
    items: []
  }, project: {
    name: 'Projects',
    slug: 'projects',
    items: []
  }, mirror: {
    name: 'Mirrored Code Snippets',
    slug: 'mirrored',
    items: []
  }, colophon: {
    name: 'Colophon',
    slug: 'colophon/update',
    items: []
  }
}));

const contentPaginatedByType = (collection) => contentTypes(collection)
  .filter(type => type.slug !== 'projects')
  .reduce(paginateContentTaxonomy(), []);

const contentPaginatedByTopic = (collection) => contentTags(collection)
  .reduce(paginateContentTaxonomy('topic/'), []);

const nowUpdates = (collection) => [...collection.getFilteredByGlob('./now/*.md')
  .filter((post) => !post.data.draft)];

module.exports = {
  post,
  contentTags,
  contentTypes,
  contentPaginatedByType,
  contentPaginatedByTopic,
  nowUpdates
}
