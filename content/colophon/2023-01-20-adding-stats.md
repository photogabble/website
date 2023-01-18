---
title: "Adding statistics to 11ty"
tags: [Blogging]
growthStage: budding
---

Last month I stumbled upon [Tim Hårek Andreassen's blog stats page](https://timharek.no/stats/) and thought it cool enough to open issue [#148](https://github.com/photogabble/website/issues/148) as a reminder to add the same to PhotoGabble.

Tim's blog uses the [Zola](https://www.getzola.org/) static site generator and therefore made use of the filters built into Zola for discovering the following statistics:

- Total words written
- Total posts published
- Average words per post
- First Post (linked)
- Longest Post (linked) with word count
- Number of posts, total words and average words per post by year
- Top Tags by posts

I have already written code for "Top Tags" the output of which can be seen at the bottom of the main [Photogabble Archive page](/blog/) and I wrote [@photogabble/eleventy-plugin-word-stats: a word stats plugin for Eleventy](https://github.com/photogabble/eleventy-plugin-word-stats) which can help with obtaining the other stats.

For the rest of the stats I began with the following 11ty filter function:

```js
collectionStats: (collection) => collection.reduce((stats, item) => {
  // Todo: more magic...
  return stats;
}, {
  totalWords: 0,
  totalPosts: 0,
  firstItem: null,
  longestPost: {
    wordCount: 0,
    item: null,
  },
  byYear: []
})
```

