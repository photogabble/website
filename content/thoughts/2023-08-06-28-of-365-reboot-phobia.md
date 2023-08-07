---
title: 28 of 365, Static Site Generation, why I wrote Tapestry
tags: 
  - list/365-writing
  - 365DayProject
growthStage: seedling
---

This is day twenty-eight of my attempt to write something, anything, every day for 365 days in a row; currently 7.67% complete with a six-day streak.

—

I am the author of the [PHP Static Site Generator: Tapestry](https://www.tapestry.cloud/), at its time of creation there were only two other PHP based static site generators; [Sculpin](https://sculpin.io/) and [Jigsaw](https://jigsaw.tighten.com/), both of which I can see are still in active development.

This website was originally powered by WordPress; however when my dedicated server went down taking that version of the website with it I decided to redevelop PhotoGabble using Sculpin instead.

That went well for a while except I came across issues with the way Sculpin generated pages that stopped me from doing *something*. I say *something* because I no longer remember the reason why but, I do remember not being able to understand the Sculpin codebase well enough to fix my issue in a PR. No, instead I did what all software developers do, I developed my own software!

Sculpin uses the Twig template engine and Jigsaw uses the Laravel Blade engine; I love simplicity and so chose to go with [PHP Plates](https://platesphp.com/) which because PHP is essentially a template engine in its own right, provides a Twig inspired thin layer of helpers while remaining 100% PHP.

The last version of Tapestry was [v1.0.12](https://github.com/tapestry-cloud/tapestry/releases/tag/1.0.12) released in January of 2018; five years ago... this project had massive potential, it still does. I began a [v2 refactoring of Tapestry](https://github.com/tapestry-cloud/tapestry/tree/2.0.0-dev) that was last touched in August 2018 however because I started using [[Why Netlify?|Netlify]] to deploy PhotoGabble I switched from Tapestry to [[Why I use 11ty|11ty]] as my static site engine and at this point refactoring the website to use Tapestry would probably be as big as job as rewriting Tapestry itself.

—

I have always had the thought that Tapestry is only temporarily shelved, originally it was because I had been made redundant, and then because a second baby came along and then, and then.

The project itself has a pretty solid set of unit tests and the documentation makes for a good specification. Maybe one day i'll bring it out of hibernation, maybe once I get the [[Rebuild The Kabal Invasion|rebuild of The Kabal Invasion]] finished i'll return to it. Maybe.

🌻