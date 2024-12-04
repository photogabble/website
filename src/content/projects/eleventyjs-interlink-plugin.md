---
date: 2022-02-01
title: Eleventy.js Interlink Plugin
subTitle: Obsidian WikiLinks, BackLinks and Embed support for 11ty
description: A lightweight wrapper for making available reading-time to the Eleventy Static Site Generator.
git: https://github.com/photogabble/eleventy-plugin-interlinker
npm: https://www.npmjs.com/package/@photogabble/eleventy-plugin-interlinker
tags:
  - status/featured
  - language/JS
  - 11ty
---

I use [Obsidian.md](https://obsidian.md/) to draft my posts before they are published on PhotoGabble. One feature of #Obsidian that I love is interlinking between notes and being able to see the connectivity graph of each note.

In January 2023 I wrote about how I [[Adding Wiki Links to 11ty|added Wiki Links support to Eleventy.js]] and in doing so this plugin was borne. It has since been updated to include support for Obsidians [embedding files](https://help.obsidian.md/Linking+notes+and+files/Embedding+files).

## Install

```bash
npm i @photogabble/eleventy-plugin-interlinker
```

## Configuration

```ts
type EleventyPluginInterlinkOptions = {
    // defaultLayout is the optional default layout you would like
    // to use for wrapping your embeds.
    defaultLayout?: string,

    // layoutKey is the front-matter value used for a per embed
    // template, if found it will replace defaultLayout for
    // that embed. This will always default to `embedLayout`.
    layoutKey?: string,

    // unableToLocateEmbedFn is invoked when an embed is unable
    // to be found, this is normally due to a typo in the
    // slug that you are using. This defaults to a function
    // that returns [UNABLE TO LOCATE EMBED].
    unableToLocateEmbedFn?: ErrorRenderFn,

    // slugifyFn is used to slugify strings. If a function
    // isn't set then the default 11ty slugify filter is used.
    slugifyFn?: SlugifyFn
}
```

## Usage
In your Eleventy config file (defaults to .eleventy.js):

```js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(
    require('@photogabble/eleventy-plugin-interlinker'),
    {
      defaultLayout: 'layouts/embed.liquid'
    }
  );
};
```

### Internal Links / Wikilinks

This plugin will now parse all Wiki Links formatted for example, `[[Eleventy.js Interlink Plugin]]` appears as [[Eleventy.js Interlink Plugin]].

Using the vertical bar (`|`) you can change the text used to display a link. This can be useful when you want to work a link into a sentence without using the title of the file, for example: `[[Eleventy.js Interlink Plugin|custom display text]]` appears as [[Eleventy.js Interlink Plugin|custom display text]].

### Aliases

Aliases provide you a way of referencing a file using different names, use the `aliases` property in your font matter to list one or more aliases that can be used to reference the file from a Wiki Link. For example, you might add _AI_ as an alias of a file titled _Artificial Intelligence_ which would then be linkable via `[[AI]]`.

### Embedding

Embedding files allows you to reuse content across your website while tracking what pages have used it.

To embed a file add an exclamation mark (`!`) in front of any wiki link for example: `![[Artificial Intelligence]]`. The embedded file will be rendered using 11ty's Template Engine. If you have defined a default embedding layout through `defaultLayout` or the page being embedded has front matter keyed as `layoutKey` then the embed will be rendered wrapped with the discovered template.

### Back Links

A backlink for a page is a link from another page to that page; this plugin tracks all backlinks through either embedding or internal wikilinks. This data is made available to your page via its `backlinks` data value.

You can then display this information in any way you would like, I use the below snippet the result of which you can see in most pages on PhotoGabble.

{%raw%}
```twig
{% if backlinks.length > 0 %}
    <nav>
        <h3>Linking here</h3>
        <ul>
            {% for link in backlinks %}
                <li><a href="{{ link.url }}">{{ link.title }}</a></li>
            {% endfor %}
        </ul>
    </nav>
{% endif %}
```
{%endraw%}

## Known Caveats

- This plugin doesn't implement all [Obsidians wikilink support](https://help.obsidian.md/Linking+notes+and+files/Internal+links) for example linking to a block in a note and linking to a heading in a note is not currently supported by this plugin
- Doesn't identify regular internal links e.g `[Link](/some/file.md)`
- Only supports embedding one note inside another, no other Obsidian file embedding functionality is currently supported by this plugin 

## Roadmap

I'd like to add missing features that others might use from Obsidian.md. For example #WikiLinks that point to a heading within the destination and embeds that are able to reference a heading or block within the source document.

In addition, being able to add a node graph view to visually show interlinking would be _cool_!

## License

This 11ty plugin is open-sourced software licensed under the [MIT License](https://github.com/photogabble/eleventy-plugin-interlinker/blob/main/LICENSE)
