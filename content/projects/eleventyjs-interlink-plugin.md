---
date: 2022-02-01
title: Eleventy.js Interlink Plugin
sub_title: Obsidian WikiLinks, BackLinks and Embed support for 11ty
description: A lightweight wrapper for making available reading-time to the Eleventy Static Site Generator.
git: https://github.com/photogabble/eleventy-plugin-interlinker
npm: https://www.npmjs.com/package/@photogabble/eleventy-plugin-interlinker
featured: true
language: JS
tags: [11ty, JavaScript]
---


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

## Known Caveats

## Roadmap

I'd like to add missing features that others might use from Obsidian.md. For example #WikiLinks that point to a heading within the destination and embeds that are able to reference a heading or block within the source document.

In addition, being able to add a node graph view to visually show interlinking would be _cool_!

## License

This 11ty plugin is open-sourced software licensed under the [MIT License](https://github.com/photogabble/eleventy-plugin-interlinker/blob/main/LICENSE)
