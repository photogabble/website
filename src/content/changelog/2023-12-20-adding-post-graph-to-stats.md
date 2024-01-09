---
title: "Addition of Post Graphs to Stats page"
tags: [Blogging, 11ty]
growthStage: budding
---

[[Serendipity]] is one of my favourite words and today its meaning came out in full force to send me down an interesting [[Rabbit Hole]]. Ever since finding [Tim Hårek Andreassen's blog stats page](https://timharek.no/stats) and making my own [shameless clone](/stats/)[^1] I have thought about also adding a GitHub style display of posts over time or more graphs at the very least. I never found the time and was pleasantly surprised when a post by [[Juha-Matti Santala's Website|Juis]] came across my Mastodon feed. Juis was sharing that he had installed [[@rknightuk/eleventy-plugin-post-graph]] a plugin by [[Robb Knight's Website|Robb Knight]].

Excited I instantly stopped what I was doing, and installed the plugin myself. To my delight it worked flawlessly! Robb even added a limit feature so that I could be lazy and use {%raw%}`{% postGraph collections.post, {sort: 'desc', limit: 2} %}`{%endraw%} to load the most recent two years of graphs.

You can see these now on my [stats](/stats/) page, as well as graphs for all years I published over on [all time stats](/stats/all-time/).

I thought I was almost alone in my geeky enjoyment of this kind of stats, and blog stats in general; up until now I only knew of Tim to have done so.

Having found a few new interesting blogs to add to my blogroll I think I will take inspiration from Juah's post [I gamified my own blog](https://hamatti.org/posts/i-gamified-my-own-blog/) and add some badges and challenges for 2024.

A big thank you to Robb for writing the plugin as well as to Juis for sharing. If I hadn't been watching my feed at the right time I might not have discovered this plugin for a while longer, if ever. 

If you have a 11ty powered blog, give adding a stats page a go. It can be fun. 

[^1]: Something I documented within [[Adding statistics to 11ty]] in January this year.