---
title: "Cool URls don't change"
tags:
  - Blogging
  - stage/budding
---

Earlier this year I reorganised PhotoGabble into being more of a Digital Garden than a Blog. As a result, the majority of the existing url structure changed which resulted in a lot of old links becoming dead.

There are obvious [negative impacts to SEO that come with URL structure changes](https://www.loudmouth-media.com/blog/why-changing-your-url-structure-is-bad-for-seo) however, at the time of making the change this wasn't a concern of mine. PhotoGabble's target audience is very small, mostly my future self and others with overlapping interests in the same things I have worked on. At the time of making hundreds of URLs resolve to a 404 I didn't think the impact would be huge, I was wrong.

I very quickly discovered broken links in [Obsidian](https://obsidian.md/); my note-taking app of choice. This wasn't too much hassle to amend piecemeal however the bigger picture was much worse and worse still I was up until recently blind to it.

At time of writing this website is deployed by and hosted on [Netlify](https://www.netlify.com/), prior to that I self-hosted with Nginx and used Go Access (see [[Thoughts on GoAccess]]) to provide traffic reports including 404 URLs.

Every so often I would go through the list of 404 URLs and where possible update my Nginx config to produce a 301 redirect to the correct location if found. Netlify charge $9 a month for [Netlify Analytics](https://www.netlify.com/products/analytics/), not a _lot_ of money but certainly more than the _free_ I was paying before. Therefore, I no longer had visibility on any broken links.

For the purpose of seeing how many people might have read what I make time to publish, PhotoGabble uses the open source web analytics platform [GoatCounter](https://www.goatcounter.com/) to provide privacy-friendly web analytics however until now if a URL resulted in a 404 the default Netlify error page was displayed and so GoatCounter never tracked the link.

It's for these two reasons that I was unaware of the impact my refactoring had made. Beyond the personal inconvenience of updating my own links I wouldn't have been aware of the larger issue if it was not for checking with [Google Webmaster Tools](https://search.google.com/search-console/about) and seeing a huge number of page errors.

Once I became aware of the dead links I soon discovered that a number of my pages had been linked to from forum posts and in a few cases were the only pages I could find with the information others had been looking for.

In order to quickly get on top of things I used the csv output from Webmaster Tools and created a Netlify `_redirects` file to catch the hundred or so listed there. In addition to that I have created a brief `404.html` file in order to allow the tracking of all future 404 paths.

Hopefully over time I should be able to repair any additional broken URLs because cool URLs shouldn't change, and I was a fool to break them.
