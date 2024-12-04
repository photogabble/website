---
date: 2022-01-31
title: Eleventy.js Font Subsetting Plugin
subTitle: Font Subsetting made easier...
description: 
git: https://github.com/photogabble/eleventy-plugin-font-subsetting
npm: https://www.npmjs.com/package/@photogabble/eleventy-plugin-font-subsetting
tags:
  - status/featured
  - language/JS
  - 11ty
---

While adding fonts to PhotoGabble and seeking smaller assets to support people with low-bandwidth connections I began learning about Font Subsetting which I wrote about in [[Font Subsetting with Eleventy.js]].

After writing that tutorial I continued amending the code and turned it into an #11ty plugin propper.

## Dependencies

This plugin depends upon [Pythons fonttools library](https://github.com/fonttools/fonttools) specifically its [pyftsubset](https://fonttools.readthedocs.io/en/latest/subset/index.html) tool. Therefore, this plugin depends upon Python and `pyftsubset` being available in your `PATH`.

## Install

```
npm i @photogabble/eleventy-plugin-font-subsetting
```

## Configuration

```ts
type EleventyPluginFontSubsettingOptions = {
    // dist is the destination path for the subset fonts, when set 11ty
    // is configured to addPassthroughCopy this path. If not set then
    // the subset fonts will be output in their source path dir.
    dist?: string

    // enabled when set to false will disable running of the plugin, this
    // is useful for programmatically deciding which environment you
    // want font subsetting to run.
    enabled?: boolean

    // srcFiles is a list of source file pathnames, it must contain at
    // least one item.
    srcFiles: Array<string>

    // cache is an object able to store and retrieve values with a TTL.
    // If not set then the plugin will default to an in memory cache.
    cache?: CacheInterface
}
```

By default, if no `cache` is supplied then this plugin will use an in memory implementation. In order to persist to disk between runs you will want to pass a implementation of `CacheInterface` as detailed below:

```ts
interface CacheInterface {
    has(key: string): any;

    get(key: string): any;

    set(key: string, value: any, ttl?: number)
}
```
For PhotoGabble I use my own implementation; I haven't tested but [node-cache](https://www.npmjs.com/package/node-cache) should be an easy drop in, alternatively you can write your own implementation to meet your needs.

## Usage

In your Eleventy config file (defaults to .eleventy.js):

```js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(
    require('@photogabble/eleventy-plugin-font-subsetting'),
    {
      srcFiles: [
        './_assets/fonts/font-source-1.woff2',
        './_assets/fonts/font-source-2.woff2',
      ],
      dist: './fonts',
      enabled: process.env.ELEVENTY_ENV !== 'production'
    }
  );
};
```

The above configuration will take two font source files, subset them and output each to `./fonts` where 11ty will then copy them to your build directory. This will only happen when the environment isn't the production build.

I choose to run subsetting in development builds because it's something that infrequently needs to do work and the result can be committed to the code repository.

![Console output from subsetting, shows 152 unique glyphs found and progress on subsetting four font files](/img/eleventyjs-font-subsetting-plugin-1.png "This is going to take a few minutes...")

## Known Caveats
- In order to make it most performant the method used for obtaining unique characters is very brute-force and isn't yet aware of [HTML Entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity).
- Due to the font subset being absolutely cut down to only include the characters used in your content; if a visitors browser translated your page into their native language then the text rendering will become broken as the browser obtains missing characters from a fallback system font (if you provided one.)

## Roadmap

Add the ability to split input fonts by language so that when people translate the page into their native language glyphs are available for characters that would otherwise not be found on the page.

This can be done via exporting a single _default_ subset and then using the glyphs from that to mask those split by language. Adding this feature will also require the plugin outputting the css required for loading the fonts as they will need to use CSS font-mask

## License

This 11ty plugin is open-sourced software licensed under the [MIT License](https://github.com/photogabble/eleventy-plugin-font-subsetting/blob/main/LICENSE)
