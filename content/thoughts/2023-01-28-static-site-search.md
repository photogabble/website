---
title: Static Site Search Providers
tags: ["Blogging", "StaticSites", "11ty"]
growthStage: budding
---

## Preface
The very first issue for `@photogabble/website` was  posted on March 31st, 2021 titled: [Service: Static site search provider](https://github.com/photogabble/website/issues/1) and for nearly three years it sat there with only the url for [Stork Search's Roadmap](https://stork-search.net/roadmap) and no other comments.

Since then, I have visited the issue a handful of times but never tried to implement search into this website due to each solution I found suggesting sending a giant json file containing all the searchable content.

Now three years after I first approached the subject I have decided to sit down and spend some time researching different solutions for providing search functionality to a static site.

I am aware of solutions such as [ElasticSearch](https://github.com/elastic/elasticsearch), [TypeSense](https://typesense.org/) and [Apache Solr](https://solr.apache.org/) however these all require running a backend, and I am more interested in solutions that can run in the browser or better still in a serverless function #JAMStack style.


## Algolia
It feels as though [Algolia](https://www.algolia.com/) is used to power the search functionality for a _lot_ of websites; I most often use it to find what I am looking for in the [Laravel documentation](https://laravel.com/) and actually the majority of the time I use search provided by Algolia it's on various projects documentation something I think is due to [Algolia's Docsearch product](https://docsearch.algolia.com/) being offered for free.

{% figure "/img/static-site-search-providers-1.png" "Fig 1. Very clean, very nice" "Search interface shown as a pop-up modal." %}

Algolia is "Search as a Service" (SaaS) and as such comes with a fair free usage tier. It's very plug and play with many tutorials already available if you want to go down that route. I honestly prefer a minimalist approach to how many third party services I use - *the fewer, the better* - and so Algolia isn't the best solution for my needs.


## Stork Search
[Stork](https://stork-search.net/) is an open source library written by [James Little](https://jameslittle.me/) for creating fast and accurate full-text search interfaces. At the time of writing its most recent version v1.6.0 was released only a couple of days ago on the 11th January making it visibly maintained.

{% figure "/img/static-site-search-providers-2.png" "Fig 2. Stork Search feels  Algolia inspired" "Search interface showing a scrollable pop down display of search results. Each result is shown as the page title and the appropriate excerpt with the search term highlighted." %}

Stork's search interface is fast, minimalist but also incredibly functional. It feels similar to Algolia but distantly so. I was very close to implementing Stock into this website, it's documentation even dedicates a page to [Building a Search Index on every Netlify Deploy](https://stork-search.net/docs/stork-and-netlify) which it does so for #11ty. However, the one thing that put me off using Stork was that it requires downloading a binary to generate your index.

This is because Stork is made up of two parts: a **command-line tool** written in Rust which indexes content and creates the search index file to be used by the **Javascript library** to build an interactive search interface. If the command line tool was installed via `npm` much in the same way that [`node-canvas`](https://www.npmjs.com/package/canvas) or [`node-sass`](https://www.npmjs.com/package/sass) ship their binaries then this would be a done deal. I'm not opposed to having the binary, but I know without its existence being managed by package control I will _not_ remember to update it.


## lunr.js
[Lunr](https://lunrjs.com/) positions itself as _"a bit like [Solr](https://solr.apache.org/), but much smaller and not as bright."_ Unlike Stork Search where the indexing and searching are split into separate tasks, Lunr does it all in one. You provide Lunr a json file containing your "index" and a search term and it returns an array of matching documents with a score of how closely they match the search query.

{% figure "/img/static-site-search-providers-3.png" "Fig 3. A more traditional search interface" "Webpage with a search bar, something has been entered into the search bar and the page's content has been filtered to only show entries that match with the search term highlighted" %}

The [lunr.js demo](https://olivernn.github.io/moonwalkers/) shows a rather traditional approach to a search interface. Unlike with Stork or Algolia, Lunr's example usage is much more familiar to how most websites do search. Initially I thought while tinkering with its demo that it's search algorithm isn't that accurate, for example it would return for "Richard" but not for "Rich". However, I then realised that it's not doing fuzzy search by default and "Rich*" indeed returned what I was expecting it to return for "Rich".

Another benefit of Lunr is that I could sit it within a serverless function and have the front end communicate with that for search results negating the need to ship the browser a potentially huge json index file.

Unfortunately not seeing any commits to its repository since August 2020 and having very active issue and PR listings tells me that it has fallen into the category of unmaintained. While I do believe in projects being considered [[What Finished looks like|finished]], this one feels abandoned. I do hope it doesn't remain so for long.


## Elasticlunr.js
I discovered [Elasticlunr](http://elasticlunr.com/) via Duncan McDougall's article: [Add Search to an Eleventy website with Elasticlunr](https://www.belter.io/eleventy-search/). It just so happens that Elasticlunr has been developed based upon Lunr and markets itself as a more flexible replacement. Dissapointingly however the last commit to [the Elasticlunr.js code repository](https://github.com/weixsong/elasticlunr.js) was in October 2019 which makes it more unmaintained than Lunr.

The [Elasticlunr.js demo](http://elasticlunr.com/example/index.html) shows a traditional approach to a search interface. However, as with the Lunr demonstration this is more to show the capabilities of the library rather than how it should be used in your project.

Unlike with Stork Search or Algolia neither Elasticlunr nor Lunr provide a slick interface out of the box, you the developer are expected to handle that yourself; this is fine, but it makes it far less of a plug and play solution.


## Fuse.js
Much like with Elasticlunr I discovered Fuse through someone else's usage of it with Eleventy. In this case it was the [code repository for gregghoush.com](https://github.com/greggh/gregghoush).

Fuse is a lightweight fuzzy-search library with zero dependencies, compared to the aforementioned this is the most bare-bones solution and requires additional work to make into something usable for end users.

From a quick glance at [the Fuse.js code repository](https://github.com/krisk/Fuse) I can see that the project is still relatively active with a number of maintainers and very recently a promising looking large PR was opened with a refactor of the entire repository to bring it up to modern standards, this brings it in line with Stork Search in terms of maintenance score (if I were doing such a thing...)

The lightweight nature of this library means it joins the likes of Elasticlunr and Lunr in expecting you to provide the interface. Similarly, it also lends itself to either being run in the browser _or_ server side which helps with bandwidth.


## In conclusion
All the aforementioned projects are workable solutions for adding full text search to your static site, however, they aren't all equally maintained and excluding Algolia due to it being SaaS only Stork Search provides a ready to use interface out of the box.

Algolia is probably the best batteries included solution, its used by at least ten thousand customers[^1] and has a free tier that most personal websites would comfortably fit into. That being said, in seeking minimalism in both design and architecture I will not be using Algolia for this website. I want a solution I can [[Self hosting is the new old web|self host]].

I personally think Stork Search is the next best thing to Algolia, it feels fast and looks accurate. The only thing that holds me back from using it is the additional complexity of maintaining a compiled binary.

Next to Stork Search, Lunr, Elasticlunr and Fuse all provide functionality that on the surface is similar enough not to distinguish them. Out of the three however, Fuse comes out ahead. This is purely based upon it being more recently maintained and having a visible group of maintainers.

In the [[The Near Future|near future]] I will be making use of Fuse.js to teach Eleventy how to do search.

[^1]: sourced from [the Algolia homepage](https://www.algolia.com/) stating that "17,000+ global customers use Algolia"
