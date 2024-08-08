---
title: Button Board
description: Like a blogroll but via the medium of 88x21 gifs
list_category: community
permalink: '/button-board/'
---

Welcome to my button board, below is a list of websites from my [bookmarks](/resources/bookmarks/) which have pretty buttons.

{% buttonBoard items %}

When I first added this button board it was primarily to include the buttons of websites I had added to my [bookmarks](/resources/bookmarks/); however being the digital magpie that I am I quickly began collecting buttons of long since dead websites, or buttons that don't have a webpage to link to.

Some of the below link through to a note giving details of what they used to belong to.

{% assign dead = items | whereKeyEquals: 'dead', true %}
{% buttonBoard dead %}
