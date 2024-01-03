---
title: My 11ty Plugins
description: A list of plugins that I have written for the eleventy static site generator.
tags:
  - 11ty
---

This is an [[Anchor page]] for listing [eleventy.js](https://www.11ty.dev/) plugins that I have written.

## [[Eleventy.js Interlink Plugin]]
[view on npm](https://www.npmjs.com/package/@photogabble/eleventy-plugin-interlinker) | [view on GitHub](https://github.com/photogabble/eleventy-plugin-interlinker)

I use Obsidian.md to draft my posts before they are published on PhotoGabble. One feature of #Obsidian that I love is interlinking between notes and being able to see the connectivity graph of each note. Out of all the plugins I have written for Eleventy this one gets the most use. I have yet to add the ability to output a node graph but being able to paste notes from Obsidian into my site repository and have the wiki links just work is incredible!

—

## [[Eleventy.js Blogtimes Plugin]]
[view on npm](https://www.npmjs.com/package/@photogabble/eleventy-plugin-blogtimes) | [view on GitHub](https://github.com/photogabble/eleventy-plugin-blogtimes)

This plugin is a direct port of [[Blogtimes: A trip down memory lane|the WordPress plugin Blogtimes]] which was also the second plugin written for WordPress. History! The blogtimes histogram it produces can be seen on my [stats page](/stats) alongside the newer GitHub style ones output by Robb Knight's [[@rknightuk/eleventy-plugin-post-graph]] plugin.

—

## [[Eleventy.js Word Stats Plugin]]
[view on npm](https://www.npmjs.com/package/@photogabble/eleventy-plugin-word-stats) | [view on GitHub](https://github.com/photogabble/eleventy-plugin-word-stats)

This plugin is a lightweight wrapper for making available [reading-time](https://www.npmjs.com/package/reading-time) as a filter. I had intended to extend this plugin to provide more extensive statistics over a collection of posts replacing the code I wrote for my [stats page](/stats) however, John Wargo beat me to the punch line with their [Eleventy Post Statistics](https://github.com/johnwargo/eleventy-plugin-post-stats) plugin.

—

## [[Eleventy.js Font Subsetting Plugin]]
[view on npm](https://www.npmjs.com/package/@photogabble/eleventy-plugin-font-subsetting) | [view on GitHub](https://github.com/photogabble/eleventy-plugin-font-subsetting)

This plugin grew out of the tutorial I wrote on [[Font Subsetting with Eleventy.js]] it's able to scan your project and compile an optimised set of font files that only contain the Glyphs that you use.



