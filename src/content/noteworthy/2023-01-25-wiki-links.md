---
title: "Adding Wiki Links to 11ty"
tags: 
  - Blogging
  - 11ty
  - Wiki Links
  - stage/seedling
aliases: [wiki-links]
---

I use [Obsidian.md](https://obsidian.md/) to draft my posts before they are published on PhotoGabble. One feature of #Obsidian that I love is interlinking between notes and being able to see the connectivity graph of each note.

## Preface

[[My publishing workflow]] typically consists of creating new notes in Obsidian and dumping in a lot of research links, random thoughts and references to other notes via use of Obsidian's built-in [Wikilinks](https://en.wikipedia.org/wiki/Hyperlink#Wikis) function; specifically, any `[[bracketed]]` word is converted to a link.

A while back I brought that functionality over to PhotoGabble and with it the concept of back links and the connectivity graph that I like from Obsidian[^1]. This means I can interlink any two pages and display "what else links here".

## Teaching 11ty Wikilinks

This solution borrows from [[Evan Boehs Digital Garden]], specifically the source of their [garden.11tydata.js](https://git.sr.ht/~boehs/site/tree/master/item/html/pages/garden/garden.11tydata.js). In order to parse content for backlinks and relevant page metadata this solution is made up of two parts:

- A computed data function for calculating backlinks and filling a `Map()` with useful page metadata
- A [Markdown It](https://github.com/markdown-it/markdown-it) plugin for parsing wikilink syntax and replacing with `<a>` tags based upon lookup of aforementioned `Map()`


### The Markdown It Wikilink plugin:

{% raw %}
```js
module.exports = function(md, linkMapCache) {
  // Recognize Mediawiki links ([[text]])
  md.linkify.add("[[", {
    validate: /^\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/,
    normalize: match => {
      const parts = match.raw.slice(2, -2).split("|");
      const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());
      const found = linkMapCache.get(slug);

      if (!found) throw new Error(`Unable to find page linked by wikilink slug [${slug}]`)

      match.text = parts.length === 2
        ? parts[1]
        : found.title;

      match.url = found.permalink.substring(0,1) === '/'
        ? found.permalink
        : `/${found.permalink}`;
    }
  })
};
```
{% endraw %}

The plugin accepts an instance of markdown it (`md`) and a `Map` in the form of `linkMapCache`; the link map cache is filled by the computed data function and acts as a way of looking up the title and permalink for a given input.

If a link is valid but also contains a custom title e.g. `[[ Page Title | Override ]]` then the page will be looked up by `Page Title` and linked via `<a href="/page-slug">Override</a>`.

If a link isn't valid then unlike with Evan's solution I throw an Error. Evan has a separate collection that builds virtual stub posts for these missing pages. I have chosen to be made aware of them so that I might manually add a [[Adding stub posts | stub post]]. This is only really because it forces me to follow my own work flow, while a fully automated system would leave a lot of stubs never finished.

### Eleventy Computed Backlinks Data:

With the wikilink syntax being parsed the `linkMapCache` needs filling. To do this I needed 11ty to loop over my main posts collection and for each post: identify what it wikilinks to as well as what is wikilinking back to it. This can be done in two ways that I know of: as a map function run on the posts collection when added to 11ty or as computed frontmatter.



{% raw %}
```js
// This regex finds all wikilinks in a string
const wikilinkRegExp = /(?<!!)\[\[([^|]+?)(\|([\s\S]+?))?\]\]/g;

const parseWikilinks = (arr) => arr.map(link => {
  const parts = link.slice(2, -2).split("|");
  const slug = slugify(parts[0].replace(/.(md|markdown)\s?$/i, "").trim());

  return {
    title: parts.length === 2 ? parts[1] : null,
    link,
    slug
  }
});

// This function gets past each page via *.11tydata.js in order to
// fill that pages backlinks data array.
module.exports = (data) => {
  if (!data.collections.all || data.collections.all.length === 0) return [];
  const allPages = data.collections.all;
  const currentSlug = slugify(data.title);
  let backlinks = [];
  let currentSlugs = [currentSlug];

  // Populate our link map for use later in replacing wikilinks with 
  // page permalinks.
  // Pages can list aliases in their front matter, if those exist we
  // should map them as well.

  linkMapCache.set(currentSlug, {
    permalink: data.permalink,
    title: data.title
  });

  if (data.aliases) {
    for(const alias of data.aliases) {
      const aliasSlug = slugify(alias);
      linkMapCache.set(aliasSlug, {
        permalink: data.permalink,
        title: alias
      });
      currentSlugs.push(aliasSlug)
    }
  }

  // Loop over all pages and build their outbound links if they
  // have not already been parsed, this is being done in a way 
  // that is cached between reloads so restarting the dev server
  // will be required to pick up changes.
  
  allPages.forEach(page => {
    if (!page.data.outboundLinks) {
      const pageContent = page.template.frontMatter.content;
      const outboundLinks = (pageContent.match(wikilinkRegExp) || []);
      page.data.outboundLinks = parseWikilinks(outboundLinks);
    }

    // If the page links to our current page either by its title
    // or by its aliases then add that page to our current 
    // page's backlinks.
    
    if (page.data.outboundLinks.some(link => currentSlugs.includes(link.slug))) {
      backlinks.push({
        url: page.url,
        title: page.data.title,
      })
    }
  });

  // The backlinks for the current page, set to the page data
  return backlinks;
}
```
{% endraw %}

This is then used via your `*.11tydata.js` files via:

```js
module.exports = {
  eleventyComputed: {
    backlinks: (data) => backlinks(data),
  },
};
```

## Displaying the backlinks

Once done you will begin seeing any wikilinks you use get converted into links and your page data will now have a `backlinks` property that you can display to users. To do so I use the following snippet:

{% raw %}
```nunjucks
{% if backlinks.length > 0 %}
    <nav>
        <h3>Linking here</h3>
        <ul>
            {%- for link in backlinks %}
                <li><a href="{{ link.url }}">{{ link.title }}</a></li>
            {%- endfor %}
        </ul>
    </nav>
{% endif %}
```
{% endraw %}

## The Post Relationship Graph

![A giant node graph showing hundreds of interconnected circles each one an article.](/img/adding-wiki-links-to-11ty-1.png "It's satisfying to see interconnected ideas")

A lovely side effect of adding backlink support is that you now have a map of post relationships that could be exported to json and made available to the frontend for displaying as a pretty node graph much like how Obsidian does.

I'll leave that as an exercise for the reader.

[^1]: Although as of writing this I have yet to surface the graph to the website in a way that can be seen.
