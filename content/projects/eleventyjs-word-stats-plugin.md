---
date: 2022-02-01
title: Eleventy.js Word Stats Plugin
sub_title: Reading Time + Word Count for 11ty
description: A lightweight wrapper for making available reading-time to the Eleventy Static Site Generator.
git: https://github.com/photogabble/eleventy-plugin-word-stats
npm: https://www.npmjs.com/package/@photogabble/eleventy-plugin-word-stats
featured: true
language: JS
tags: [11ty, JavaScript]
---

This plugin provides a lightweight wrapper for making available [reading-time](https://www.npmjs.com/package/reading-time) to the [Eleventy](https://www.11ty.dev/) Static Site Generator.

## Install

```bash
npm i @photogabble/eleventy-plugin-word-stats
```
## Configuration
```ts
interface Options {
  output?: (stats: ReadTimeResults) => string;
  wordBound?: (char: string) => boolean;
  wordsPerMinute?: number;
}
```
### Output function
The function that controls the `wordStats` filter output is provided an object that matches the following interface:

```ts
interface ReadTimeResults {
  text: string;
  time: number;
  words: number;
  minutes: number;
}
```

## Usage
In your Eleventy config file (defaults to .eleventy.js):

```js
module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(require('@photogabble/eleventy-plugin-word-stats'));
};
```

Now the `wordStats` filter will be available to use in your templates. For example with Nunjuck it can be used as such:

{% raw %}
```twig
<p>{{ content | wordStats }}</p>
```
{% endraw %}
Which will by default output along the lines of:

```html
<p>1244 words, 6 min read</p>
```

## Not invented here
If all you need is the word count formatted, there are two very good alternatives to this plugin:

- [eleventy-plugin-time-to-read](https://www.npmjs.com/package/eleventy-plugin-time-to-read)
- [eleventy-plugin-reading-time](https://www.npmjs.com/package/eleventy-plugin-reading-time)

## License
This 11ty plugin is open-sourced software licensed under the [MIT License](https://github.com/photogabble/eleventy-plugin-word-stats/blob/main/LICENSE)