---
title: "Addition of Git Log"
tags:
  - Blogging
  - 11ty
  - stage/budding
---

With a huge thank-you to Belmin Began([@MaNemoj01](https://github.com/MaNemoj01)) for their [PR implementing git history for pages](https://github.com/photogabble/website/pull/302) this website now has a git history on each writing page. It's been a few months since I last checked the repo for this website and had this week begun working on [refactoring the repositories directory structure](https://github.com/photogabble/website/issues/304) when I noticed Belmin's PR.

Belmin's code worked well and did the job however once I had merged their PR into my branch I realised that the git history added about 100ms to each page's build time. With 800+ pages that soon adds up and while it doesn't necessarily matter during deployment you really notice when developing locally. I therefore added a cache which is keyed by the current git commit hash, that way the history is parsed once each time I make a commit. I find this an acceptable middle-ground.
