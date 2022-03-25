---
title: A 11ty Reading Time Plugin Quest
categories:
    - tools-and-resources
tags:
    - JavaScript
    - 11ty
growthStage: budding
---

While going through the stages of rebuilding this blog I thought a nice addition would be a measure of reading time presented in each posts header much like how services such as Medium seem to do.

I am using the Eleventy static site generator, therefore my first port of call was its plugin ecosystem. I quickly found [eleventy-plugin-reading-time](https://www.npmjs.com/package/eleventy-plugin-reading-time) which appears to do exactly what it says on the tin. However, at time of writing it's not seen any activity in three years and has a number of unanswered pull requests which appear to add improvements or fix issues people have had.

A lot can change in three years. For example: [Eleventy reached V1.0.0](https://www.11ty.dev/blog/eleventy-one-point-oh/). The aforementioned plugin still works with this version but I thought I should check and see if there where any alternatives that don't look as abandoned.

Another quick look turned up [eleventy-plugin-time-to-read](https://www.npmjs.com/package/eleventy-plugin-time-to-read). This time the plugin seems to be actively maintained and a lot more complex given the large amount of confirguable options.

At this point we have two good options for calculating reading time, however while they use a word count to calculate I can't find any way of displaying that and I would like to in a format similar to:

```
1,287 words, around 6 minutes to read.
```

Before continuing I would like to point out that there exists a [eleventy-plugin-wordcount](https://www.npmjs.com/package/eleventy-plugin-wordcount) plugin but it doesn't do reading time and the idea of having to related metrics calculated independently from one another feels wrong.

Therefore I continued looking until I found [reading-time](https://www.npmjs.com/package/reading-time). This is _not_ an Eleventy plugin however it does parse an input and produce statistics in the form of:

```json
{
	text: '1 min read',
	minutes: 1,
	time: 60000,
	words: 200
}
```

This is exactly what I wanted and so I went to work on creating [eleventy-plugin-word-stats](https://www.npmjs.com/package/@photogabble/eleventy-plugin-word-stats) which is a very basic Eleventy plugin that wraps this library and makes it available as the `wordStats` template tag with an output similar to _"1,287 words, around 6 minutes to read."_

In conclusion, there are several good existing plugins that will meet your needs if you would like to display reading time or word count and there is now a plugin of my creation that wraps a third party library for producing word count with reading time if that is something you would like to do.