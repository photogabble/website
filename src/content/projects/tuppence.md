---
date: 2017-11-30
title: Tuppence
description: Incredibly small PSR-7 framework
git: https://github.com/photogabble/tuppence
packagist: https://packagist.org/packages/photogabble/tuppence
tags:
  - status/featured
  - language/PHP
  - Tuppence
---

Tuppence is a _very small_ micro framework that brings together a [powerful PSR-11 dependency injection container](http://container.thephpleague.com/), a [fast PSR-7 router supporting PSR-15 middleware](http://route.thephpleague.com/) and a [simple and effective PSR-14 event dispatcher](http://event.thephpleague.com/3.0/) all provided by _The League of Extraordinary Packages_.

I have written before about [[Why I built a tiny PHP Framework called Tuppence|why I wrote Tuppence]], the TL;DR version is that the micro framework [Proton](https://web.archive.org/web/20141006222746/https://alexbilbie.com/2014/10/introducing-proton/) by Alex Bilbie was available but was by that point using out of date dependencies and rather than forking Proton I wanted to learn more about frameworks through building my own.

## Status

Up until 2023 my last commit to Tuppence was in 2018; at the time I wrote Tuppence, it fit a small niche that I was actively working in. I ended up pivoting to front end with Vue.js and decided to set Tuppence as **abandoned** because at the time I saw the serverless API features of Next.js and Nuxt.js replacing the need for an incredibly small backend framework. 

In 2023 my opinion changed and in seeking [[minimalism]] I wanted to return to using a micro framework, the result being that I have released [version two of Tuppence](https://github.com/photogabble/tuppence/releases/tag/2.0.1) with more updates planned for the future.

Contributors welcomed.
