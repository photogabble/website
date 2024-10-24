---
title: "Updated Content List Layouts"
tags: 
  - Blogging
  - stage/evergreen
---

I'm unsure how but, today I serendipitously stumbled upon [Luke Mitchell's Blog: interroban.gg](https://www.interroban.gg/). Luke's Blog is wonderfully minimalist and is, in my mind the best example of what I love to see in minimalist website design.

![Screenshot of Luke Mitchell's Blog: interroban.gg taken in September 2022](/img/interroban-gg-screenshot.png)

Updating this websites post list format was added as [issue #6: UI Idea: Post list format](https://github.com/photogabble/website/issues/6) in June of last year (2021). I originally took inspiration from [Bert Hubert's articles list](https://berthub.eu/articles/) however I fell in love with the more visually appealing design Luke has done.

![Screenshot of Bert Hubert's Blog: berthub.eu taken in September 2022](/img/berthub-eu-screenshot.png)

In a short period of time I had updated all the content lists to have a similar style to that used by Luke:

![Screenshot of Photogabble archive page: interroban.gg taken in September 2022](/img/updated-content-list-layouts.png)

This was achieved by making a nunjucks component for content lists and then refactoring everywhere I had previously copied and pasted the same list and loop. On certain pages such as the archive and topic pages I also wanted to keep the content type tag. I have lost the numbered list on the archives page, which I may in a future update, reinstate but for now I am happy with how it looks.
