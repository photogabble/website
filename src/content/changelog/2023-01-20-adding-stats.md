---
title: "Adding statistics to 11ty"
tags:
  - Blogging
  - 11ty
  - stage/seedling
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

I have already written code for "Top Tags" the output of which can be seen at the bottom of the main [Photogabble Archive page](/blog/) and I wrote [@photogabble/eleventy-plugin-word-stats: a word stats plugin for Eleventy](https://github.com/photogabble/eleventy-plugin-word-stats) (for more details read [[A 11ty Reading Time Plugin Quest]]) which can help with obtaining the other stats.

In order to obtain the other statistics I wrote a filter than reduced an input collection to the following data structure:

```ts
interface Data{
    totalWords: number;
    totalItems: number;
    firstItem?: Object;
    longestItem: {
        wordCount: number;
        item?: Object;
    }
    byYear: Map<number, DataByYear>
}

interface DataByYear {
    year: number;
    totalWords: number;
    totalItems: number;
}
```

This filter didn't actually end up directly using `@photogabble/eleventy-plugin-word-stats` for obtaining word counts, but it did use the [`reading-time`](https://www.npmjs.com/package/reading-time) library it depends upon so that my statistics all came from the same source.

You can see the live output at [/stats](/stats/).
