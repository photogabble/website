---
date: 2022-01-31
title: Eleventy.js Blogtimes Plugin
subTitle: Bringing Blogtimes to 11ty
description: A direct port from PHP of the WordPress plugin Blogtimes, which was itself ported to WordPress by Matt Mullenweg from b2 in 2003.
git: https://github.com/photogabble/eleventy-plugin-blogtimes
npm: https://www.npmjs.com/package/@photogabble/eleventy-plugin-blogtimes
tags:
  - status/featured
  - language/JS
  - 11ty
---

Blogtimes is a plugin for the Eleventy static site generator, written in JavaScript. Given a directory with a valid git repository it will generate a histogram of commit times over 24 hours defaulting to within the past 30 days.

{% figure "/img/11ty-blogtimes.png", "Look at all those late nights...", "A black and white histogram showing 24 hours with vertical lines showing when edits where made. The lines have a transparency and so the darker lines show more edits during that time." %}

It's a direct port from PHP of the [[Blogtimes: A trip down memory lane|WordPress plugin Blogtimes]], which was itself ported to WordPress by Matt Mullenweg from b2 in 2003.

You can read [[Writing Blogtimes for Eleventy.js]] to find out why this exists, suffice to say, it's a _homage_ to a simpler time.

## Install

```bash
npm i @photogabble/eleventy-plugin-blogtimes
```

## Configuration

```ts
type EleventyPluginBlogtimesOptions = {
  width?: number, // Image Width, default: 480
  height?: number, // Image Height, default: 80
  title?: string, // Title output top left, default: 'Git Commits'
  lastXDays?: number, // Time period in days, default: 30
  hPadding?: number, // Padding top and bottom, default: 5
  vPadding?: number, // Padding left and right, default: 5
  showTicks?: boolean, // Show ticks, default: true
  unitName?: string, // Units, displayed centered at bottom, default: 'hour of day'

  outputFileExtension: string, // Image mimetype, default: 'png, must be either png or jpg
  outputDir: string, // Image output directory, default: 'bt-images'
  urlPath: string, // Image url path, default: 'bt-images'
  hashLength?: number, // Image filename hash length, default: 10

  generateHTML?: Function,
}
```

## Usage

In your Eleventy config file (defaults to `.eleventy.js`):

```js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-blogtimes'),{});
};
```

You will now be able to use the `blogtimes` shortcode in your templates:

{% raw %}
```nunjucks
{% blogtimes %}
```
{% endraw %}

By default, blogtimes will process the git stats for the repository its run in. You can change that by passing an absolute path to the shortcode.

## Libraries in use

- [node canvas](https://www.npmjs.com/package/canvas)
- [bdf-canvas](https://www.npmjs.com/package/bdf-canvas)
- [git-log-parser](https://www.npmjs.com/package/git-log-parser)

## Roadmap

I consider this project [[What Finished looks like|feature complete]]. However, I will be maintaining its dependencies, and ensuring it functions on all future versions of #11ty for as long as I continue using it as a static site generator.

## License

This 11ty plugin is open-sourced software licensed under the [MIT License](https://github.com/photogabble/eleventy-plugin-blogtimes/blob/main/LICENSE). Also included in this repository
are [classic X Window System bitmap fonts](https://www.cl.cam.ac.uk/~mgk25/ucs-fonts.html) which are considered to
be [public domain](https://creativecommons.org/publicdomain/mark/1.0/).
