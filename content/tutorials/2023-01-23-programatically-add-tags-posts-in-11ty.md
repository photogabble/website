---
title: How to programmatically add tags to posts in 11ty 
tags: ["11ty"]
growthStage: evergreen
---

I use [Obsidian.md](https://obsidian.md/) to draft my posts before they are published on PhotoGabble. One feature of Obsidian that I love is its ability to autolink #hashtags and this is something I want to teach #(11ty) how to do.

## Preface

Obsidian parses hashtags so that they become linked from the post body. I first searched to see if this is something other users of Eleventy had done and quickly found this (accidentally closed) [PR for adding hashtags to notes in the Eleventy starter theme](https://github.com/binyamin/eleventy-garden/pull/33/files) as well as someone on the Eleventy discussion forum asking (without resolution) how to [programmatically identify tags from post content](https://github.com/11ty/eleventy/discussions/1494), a question I hope to answer with this tutorial post.

Both methods above made use of this simple regex `/#[\w-]+/g`. However, I quickly discovered that this creates a lot of false positives by including comments from code blocks. One solution to remove the noise is to denote a hashtag link via a `#(...)` syntax. The downside of this is that I now have to replace all usages from Obsidian with this new solution or have hashtags broken in Obsidian.

While researching fixes to the above I came across [Nicolas Hoizey's](https://nicolas-hoizey.com/) implementation of hashtag linking for their website. 

In Nicolas [notes collection source (notes.js)](https://github.com/nhoizey/nicolas-hoizey.com/blob/main/src/_11ty/collections/notes.js) you can see the raw page content being passed to a `hashtagsToTags` function to obtain an array tags. That function is using the third party [twitter-text](https://www.npmjs.com/package/twitter-text) library in order to extract hashtags from input text. 

Unfortunately this method is as noisy as the simple regex approach because it's not _context aware_. If we are going to tech Eleventy how to parse hashtags then the solution used needs to be Markdown aware. With a little more research I found the seven-year-old [markdown-it-hashtag](https://www.npmjs.com/package/markdown-it-hashtag) plugin for the markdown-it library commonly used with Eleventy.

Surprisingly for its age, this library worked although the matching regex it shipped with needed some fine-tuning as it continued to pick up hex numbers and references to GitHub issue numbers (e.g. #123) I had a few goes at formulating a regex that would match any string containing three or more alphanumerics but not all numerics, however, I am not _that_ good at Regex and ended up turning to the "void". Very soon a number of people had a go at solving the problem but [@barubary@infosec.exchange](https://infosec.exchange/@barubary) [response containing a working regex](https://notacult.social/@barubary@infosec.exchange/109740773056932482) was the best solution and they followed up with an even more terse one with `(?!\d+\b)\w{3,}`.  

## Teaching Eleventy how to parse hashtags

In order to parse hashtags with Eleventy you will need to install [markdown-it-hashtag](https://www.npmjs.com/package/markdown-it-hashtag) using `npm install markdown-it-hashtag --save-dev` or equivalent if you're using `yarn` or `npnp`.

We will be using this Markdown-It plugin in two places, first in your main collection in order to identify hashtags in posts and update the posts tags listing and secondly in your sites main usage of Markdown-It for parsing Markdown into HTML.
