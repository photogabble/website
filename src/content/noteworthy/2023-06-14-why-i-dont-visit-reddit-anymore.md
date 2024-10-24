---
title: Why I don't go to Reddit anymore
tags: 
  - Social Media
  - accessibility
  - stage/seedling
---

For several years it was rare that I would go a day without spending several hours browsing Reddit, that stopped almost entirely in 2015 with then CEO Pao's questionable sacking of Victoria Taylor. In solidarity with the uproar from the moderator community I stopped browsing Reddit and started looking for communities elsewhere. I found them in forums and Twitter (although if your reading this around the time I write this, you will already know [[Why I don't go to Twitter anymore|why I no longer use Twitter]].) Having found my people _elsewhere_ I then largely forgot about Reddit, much in the same way we all did with Digg.

I did however continue to occasionally browse some Reddit communities, or to be specific [/r/roguelikedev](https://www.reddit.com/r/roguelikedev/), [/r/basic](https://www.reddit.com/r/basic/) and [/r/vintagecomputing/](https://www.reddit.com/r/vintagecomputing/) . However, with Reddit launching its new UI in 2018 and the mobile experience becoming increasingly frustrating I ended up stopping visiting all together; replacing those subreddits with Discord communities, IRC and at the time Twitter.

—

Until the announcement by [Christian](https://mastodon.social/@christianselig) that he would be [closing down the Apollo client on June 30th](https://www.reddit.com/r/apolloapp/comments/144f6xm/apollo_will_close_down_on_june_30th_reddits/) I had all but forgotten about Reddit. I fully recommend reading Christian's post, he brings receipts and it's a very damning report on what Reddit is doing; which is in essence ultimately making it un-viable to operate a third party app.

This is a big deal because the Apollo app provided people, especially those with specific accessibility needs, a usable interface that the aforementioned new Reddit UI still doesn't provide five years after it was launched! This is even more surprising given that the old Reddit interface was and still is a lot more accessible than the current interface; however old Reddit hasn't been updated with newer functionality and nobody knows how much longer it will remain available for.

This means that for Reddit users with accessibility needs Apollo was the only viable way to use the site and for a lot of moderators the only way to access moderation tools. This has therefore caused uproar in the moderation community and a subsequent [blackout of thousands of subreddits in protest](https://reddark.untone.uk/) potentially affecting up to 2.7 billion users[^1].

A result of this is that alternatives such as Lemmy powered [Beehaw](https://beehaw.org/) have seen a sizeable increase user registrations. However, as mentioned in this [comment by user Aaron on Beehaw](https://beehaw.org/comment/123998) there is an ethical quandary with sites powered by Lemmy given that the developers building that software have allowed and as far as I am aware support extremely disturbing content to remain on their official instances.

{% figure "/img/why-i-dont-visit-reddit-anymore-01.png", "Sad fail whale song", "Screenshot of the Reddit homepage saying something went wrong and asking if you would like to retry" %}

Interestingly, while writing this note on the 12th June I attempted to visit the Reddit homepage and was surprised to see it fail to load the home feed with the Reddit request returning `429 : Too Many Requests` due to the upstream error `StatusCode.RESOURCE_EXHAUSTED : limit exceeded for limiter=GetSubreddits-ua_graphql`. It would make quite the coincidence if this outage was unrelated to the protest, I suspect their backend was struggling under the load of so many subreddits going private and needing to reload caches.

—

I will continue to have links to Reddit shared with me or show up in search results and those that are of interest I will of course still visit albeit begrudgingly, I'd be an idiot not to. However, I will not actively **participate**; that is to say no new posts and no new comments. In the past four years of not visiting I haven't missed Reddit and have ultimately replaced it with the Retro and Vintage communities on the Fediverse, Discord and elsewhere.

[^1]: However, most likely fewer due to overlapping subreddit subscriptions but even at a third of that number its a lot of people
