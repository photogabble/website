---
title: Colophon
layout: 'layouts/page-post.njk'
abstract: No website is an island, they are all built upon the combined effort of that which came before. If they are lucky, they will inspire the next generation.
---

I began writing this version of the website in December 2024, having already spent the majority of the previous eight months rebuilding the website as a two column layout inspired by [Untapped Journal](https://www.untappedjournal.com/).

Having got so close to completing the redevelopment work, you might wonder _why_ I chose to abandon it for an entirely new design. The reason was largely due to the massively increased render times. Eleventy was having to render a unique sidebar for each of the ~1,100 pages being generated. This meant that I often had to wait nearly half a minute before the page would refresh when making edits.

When building for production the build time doesn't really matter all that much, however when developing; having to wait ever-increasing lengths of time became a hindrance to progress[^1].

For a period of time I considered re-writing everything with a PHP backend so that I could negate the performance bottleneck of rebuilding the entire website for every insignificant change. However, being heavily invested in Eleventy, I couldn't bring my self to move to an alternative.

![Screenshot of untapped journal showing the two column layout](_assets/untapped-journal-screenshot.png "I genuinely enjoy this layout, I think it works best with dynamic SSR")

The tipping point came when I stumbled upon [Works In Progress](https://worksinprogress.co/) and fell in love with its design aesthetic. The layout of my article pages has been shamelessly copied from there, albeit by eye from screenshots rather than a 1-to-1 copy of the code.

## Inspiration

No website is an island, they are all built upon the combined effort of that which came before. This website is no different and it's thanks to the following people and websites (in no particular order) that you're even reading what I am writing:

The reason why this website is built by the 11ty static site generator is thanks to [Andy Bell](https://bell.bz/) and their [Piccalilli Publication](https://piccalil.li/) initially sparking my interest. I have now been using it since 2021{% ya 2021 %} and can't see myself using anything else to generate static websites!

After reading [Maggie Appleton's](https://maggieappleton.com/) essay on the [Brief History & Ethos of the Digital Garden](https://maggieappleton.com/garden-history) I was inspired to redevelop this website into a [[Digital Garden]] of my own. It was thanks to Maggie's own website being open source that I learned how to implement Wikilinks which along with [Evan Boehs](https://boehs.org/) implementation became the basis of my [[Eleventy.js Interlink Plugin]].

It was thanks to [Luke Mitchell's](https://www.interroban.gg/) website being open source, that I figured out how to use `simple-git` in order to display a history of changes for each page. The list style for my previous design was also inspired by their own and I genuinely have a fondness for their websites design.

I stumbled across one of [Cassidy Williams](https://cassidoo.co/) tweets in 2020{%ya 2020 %} leading me to [her twitch channel](https://www.twitch.tv/cassidoo) and have been subscribed ever since. She doesn't stream as much as she used to, however that subscription opened access to her Discord and interactions with many wonderful, inspirational people who I enjoy chatting with daily.

An honourable mention goes out to [Zach Leatherman](https://www.zachleat.com/) for building [11ty](https://www.11ty.dev/) and for answering the various questions I have thrown his way over the years. To continue working on a project like this, after so many years is inspirational on its own.

There are many more people I could add to this list, so many in-fact that I have created a whole [[Inspiration]] list page to showcase them, go check it out.

## Font Stack

This font stack has been influenced by [that used in gwern.net](https://github.com/gwern/gwern.net/blob/5ad7ec4f2839f0a546b7c17350ff6322f6312d2f/font/font_spec.php), I make use of my [Eleventy.js Font Subsetting Plugin](https://github.com/photogabble/eleventy-plugin-font-subsetting) in order to reduce the impact of loading multiple font files.

- [Source Serif](https://github.com/adobe-fonts/source-serif) by Adobe, workhorse font used throughout website for body text
- [IBM Plex](https://github.com/IBM/plex), used for code blocks

## Technologies

This website is a static generated site, built using [Eleventy](https://www.11ty.dev/) (11ty) and hosted with [Netlify](https://www.netlify.com/). Building this website is dependant upon the following third party libraries:

* 11ty plugins:
    * [@11ty/eleventy-cache-assets](https://www.npmjs.com/package/@11ty/eleventy-cache-assets) <small>MIT</small>
    * [@11ty/eleventy-plugin-rss](https://www.npmjs.com/package/@11ty/eleventy-plugin-rss) <small>MIT</small>
    * [@11ty/eleventy-plugin-syntaxhighlight](https://www.npmjs.com/package/@11ty/eleventy-plugin-syntaxhighlight) <small>MIT</small>
    * [eleventy-plugin-postcss](https://www.npmjs.com/package/eleventy-plugin-postcss) <small>ISC</small>
    * [@photogabble/eleventy-plugin-word-stats](https://www.npmjs.com/package/@photogabble/eleventy-plugin-word-stats) <small>MIT</small>
    * [@photogabble/eleventy-plugin-blogtimes](https://www.npmjs.com/package/@photogabble/eleventy-plugin-blogtimes) <small>MIT</small>
    * [@photogabble/eleventy-plugin-font-subsetting](https://www.npmjs.com/package/@photogabble/eleventy-plugin-font-subsetting) <small>MIT</small>
    * [@photogabble/eleventy-plugin-interlinker](https://www.npmjs.com/package/@photogabble/eleventy-plugin-interlinker) <small>MIT</small>
    * [@photogabble/eleventy-plugin-tag-normaliser](https://www.npmjs.com/package/@photogabble/eleventy-plugin-tag-normaliser) <small>MIT</small>
    * [@rknightuk/eleventy-plugin-post-graph](https://www.npmjs.com/package/@rknightuk/eleventy-plugin-post-graph) <small>MIT</small>
    * [@11ty/eleventy-img](https://www.npmjs.com/package/@11ty/eleventy-img) <small>MIT</small>
    * [@uncenter/eleventy-plugin-toc](https://github.com/uncenter/eleventy-plugin-toc) <small>MIT</small>
* [postcss](https://github.com/postcss/postcss) <small>MIT</small> & plugins:
    * [postcss-import](https://www.npmjs.com/package/postcss-import) <small>MIT</small>
    * [postcss-minify](https://www.npmjs.com/package/postcss-minify) <small>MIT</small>
    * [postcss-url](https://www.npmjs.com/package/postcss-url) <small>MIT</small>
* [markdown-it](https://github.com/markdown-it/markdown-it) <small>MIT</small> & plugins:
    * [markdown-it-anchor](https://www.npmjs.com/package/markdown-it-anchor) <small>Unlicense</small>
    * [markdown-it-footnote](https://www.npmjs.com/package/markdown-it-footnote) <small>MIT</small>
    * [markdown-it-task-lists](https://www.npmjs.com/package/markdown-it-task-lists) <small>ISC</small>
* [autoprefixer](https://www.npmjs.com/package/autoprefixer) <small>MIT</small>
* [cross-env](https://www.npmjs.com/package/cross-env) <small>MIT</small>
* [normalize.css](https://github.com/necolas/normalize.css/) <small>MIT</small>
* [node-fetch](https://www.npmjs.com/package/node-fetch) <small>MIT</small>
* [flat-cache](https://www.npmjs.com/package/flat-cache) <small>MIT</small>
* [html-minifier](https://www.npmjs.com/package/html-minifier) <small>MIT</small>
* [luxon](https://moment.github.io/luxon/#/) <small>MIT</small>
* [outdent](https://www.npmjs.com/package/outdent) <small>MIT</small>
* [Color Thief](https://github.com/lokesh/color-thief) <small>MIT</small>
* [memoize](https://www.npmjs.com/package/memoize) <small>MIT</small>

## License
Unless otherwise stated<sup>†</sup> this website and content is licensed [Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/). It's source code is freely available and hosted on [GitHub](https://github.com/photogabble/website).

> [!CAUTION] †Exemptions
> Mirrored code snippets and bundled third party resources are exempt from the license covering this website, code snippets will each display their license terms if available.

I explain _why_ I open sourced this website in [[Copy my Copywork]], the TL;DR of which is that I have benefited by learning from others source code and feel an immense sense of pride and joy when I see others learn from my work.

## Design Inspiration

- Article layout was heavily inspired by [Works In Progress](https://worksinprogress.co/)
- Prefixing figure captions with `[↑]` was taken from the [IBM Plex website](https://www.ibm.com/plex/), I thought it a small, yet nice detail.


[^1]: My style of development requires an enormous amount of iteration with some tasks taking 50-100 cycles, if each cycle takes 30 seconds that is at least 25 minutes spent on a task that I could get done quicker if I got feedback quicker.
