---
title: "Adding stub posts"
tags: [Blogging]
growthStage: seedling
---

A while back as part of converting into a #DigitalGarden I added [[Wiki links|Wiki Links]] support to PhotoGabble's #11ty build. In doing so I also made it very easy for me to interlink between pages and most importantly copy posts directly from Obsidian into markdown files in this websites repository without having to change anything.

The only problem with this approach was that now I had wikilinks brought over from Obsidian that had nothing to point to on PhotoGabble. [[Evan Boehs Digital Garden|Evan Boeh's]] solution to this was to have Eleventy automatically create stub pages which would act as placeholders until they fleshed them out else act as waypoints for finding related posts.

Because I know that any automated system would likely result in me forgetting to fill in the stubs I opted for my Wiki Links solution to break deployment on broken wiki links so that I could either add the missing files as a stub or remove the wikilink.

## What is a Stub

Within the context of this Digital Garden stubs are akin to drafts. Whereas drafts are never made public until they are published, stubs are publicly available but not included in any of the published content lists: archive, topic listings, etc. The only ways a visitor should find a stub post is if they clicked on a wiki link that pointed to one or a linking here list from a published post. 

More often than not a stub page will have nothing of merit on it except the list of "linking here" pages which acts as a "these are all related" list. 

## Upcoming posts

A nice side effect of having stubs is that I can give each one a potential future publish date making the [view all stubs](/stubs/) page a schedule of upcoming posts. With a bit of effort I could modify this page into two lists, one upcoming and one overdue. However, for now I am happy with what is there.