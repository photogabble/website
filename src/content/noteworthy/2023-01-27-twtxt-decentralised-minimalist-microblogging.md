---
title: "twtxt: the decentralised, minimalist microblog in a file"
tags: 
  - Tools and Resources
  - Decentralisation
  - Social Media
  - Wayback Machine
  - stage/seedling
---

## Preface
From looking at this website you can easily see that I am a big fan of [[minimalism]], I like to keep things as simple as possible while being both functional and aesthetically pleasing[^1]. As of writing this I do _use_ the free tier of [Netlify](https://www.netlify.com/)[^2] to host PhotoGabble *however*, I am a big fan of [[The Small Web|the Small Web]], decentralisation and [[Self hosting is the new old web|self hosting]].

While researching [[Webrings]] and browsing the [xxiivv webring](https://webring.xxiivv.com/) I noticed the _"show twtxt"_ option which piqued my interest and subsequently ended up down a [[rabbit hole]] deeper than the [Cerro Gordo Mine](https://www.youtube.com/@GhostTownLiving) . I will now attempt to articulate my journey and best convey my understanding of the `twtxt` protocol.

## What is it?
Within the [official docs for the `twtxt` project](https://twtxt.readthedocs.io/en/stable/index.html) it describes itself as *"a decentralised, minimalist micro-blogging service for hackers,"* but what does that actually mean? At its core it's a format specification for self-hosted flat file based micro-blogging. You host a `twtxt.txt` which contains all your posts and other clients can discover that file and display its content. Yes, it's seriously that basic, this is what a sample file looks like:

```
2016-02-04T13:30:00+01:00   You can really go crazy here! ┐(ﾟ∀ﾟ)┌
2016-02-03T23:05:00+01:00   @<example http://example.org/twtxt.txt> welcome to twtxt!
2016-02-01T11:00:00+01:00   This is just another example.
2015-12-12T12:00:00+01:00   Fiat lux!
```

Twtxt aware clients can discover that file and display its content in a nicely formatted way. If this feels familiar to those over a certain age then that's because it's similar to how the [Finger protocol](https://en.wikipedia.org/wiki/Finger_(protocol)) was used by some.

A group of people maintain the official [twtxt client](https://github.com/buckket/twtxt) written in Python. It provides a nice command line interface for viewing your timeline, appending a new tweet to your twtxt file, see who you're following and follow/unfollow someone else.

On that last point due to the decentralised nature of the protocol [discoverability](https://twtxt.readthedocs.io/en/stable/user/discoverability.html) is an issue, you don't know who is following you, finding other users is difficult, and it's not possible to see posts that mention you if you don't already follow their feed. To aid discoverability the `twtxt` client uses a specially crafted User-Agent string to allow other users to search their webserver’s log file, it's clunky, but it works.

## Directory of users
This post has been a few years in the making and when I began doing research into `twtxt` the domain `twtxt.xyz` both hosted a directory of twtxt users and acted as `twtxt` as a service. Unfortunately, its [GitHub repository: reednj/twtxt-directory](https://github.com/reednj/twtxt-directory) was archived on November 17th, 2022, a few months[^3] after the domain expired and subsequently ended up in the hands of squatters.

The [Wayback machines last good capture of twtxt.xyz](https://web.archive.org/web/20220313154836/http://twtxt.xyz/) was from March 13th, 2022 however the repository behind the website was last touched in 2017 so while I can see that there was user activity right up to the end the website itself was likely abandoned long before the domain went offline.

## Yarn.social
[Yarn.social](https://yarn.social/) is a self-hosted social media based on the `twtxt` format with [extensions](https://dev.twtxt.net/); it feels similar to other decentralised social media such as the ActivityPub based [Mastodon](https://joinmastodon.org/) software however, it's much less popular and because of that there are only a handful of Yarn Social servers.

Given that `twtxt` appears to be intended as a purely minimalist format to be self-hosted by each user, it could be said that Yarn Social's centralisation of users and extensions to the format go against the spirit of `twtxt`. Arguably if you wanted those additional features choosing an ActivityPub based software might be the optimal solution.

I like the simplicity of the `twtxt` format, yet I also appreciate the existence of Yarn Social and projects like it.

## 0xFF's Picoblog
After a few hours of browsing various `twtxt` feeds, using each one I found to discover others, I stumbled upon a [tool for turning twtxt into a html page called Picoblog](https://0xff.nu/picoblog) written by [Paul Glushak](https://0xff.nu/). Much like the `twtxt` format, Picoblog is extremely simple, but it gets the job done, at it's core is a [184 LoC picoblog.php file](https://github.com/hxii/picoblog/blob/master/picoblog.php) that parses an input `twtxt` file and renders them to HTML.

It supports the `twtxt` format as well as a `picoblog` format which extends the former with unique ids, I am unsure why, but the [picoblog format specification](http://wiki.0xff.nu/picoblog/spec) details how they are to be generated.

You can see an example of its HTML output in [Paul's Microblog](https://0xff.nu/microblog).

## Closing thoughts
I find it entertaining that the index of https://ferengi.one/twtxt.txt is a blank orange page with an image of Quark from DS9 with nothing to suggest anything else exists at the domain; its `twtxt` file is part of the "dark web", except of course it isn't because [a quick search on Google](https://www.google.com/search?q=ferengi.one%2Ftwtxt.txt) shows it's very much aware it exists.

Simplicity in technology is a good thing to strive for and you can't get much simpler than a human-readable format in a text file. Does it have flaws? Yes, many. Will it appeal to a wider audience outside of geeks like me? No, or at least not without efforts from projects like Yarn Social attempting to make it more user-friendly.

Unlike with other social media, `twtxt` doesn't require a lot of bandwidth; text is very compressible. It's also offline first, you run the client on your local machine and upload its result. This will benefit people such as the [Hundred Rabbits collective](https://wiki.xxiivv.com/site/hundred_rabbits.html) where you might want to keep a digital micro blog of your daily activities while also being 200 miles from the nearest internet access.

`twtxt` walks the line of minimalism between making something unusable or making something unbearable to use; I feel it fits in a particular niche where it is being used by _many_ people today.

I love it for its simplicity despite its shortcomings and plan on doing something with it in the [[near future]].

[^1]: There is no need to make something unusable, or unbearable to use.
[^2]: I began using Netlify because [Cassidy Williams](https://cassidoo.co/) worked there, and it's free tier met my needs while I was switching servers. I never got round to moving PhotoGabble back onto my then new dedicated box and it being hosted for free means I have no pressing need to migrate elsewhere.
[^3]: The wayback machine [shows the domain expired around May 18th, 2022](https://web.archive.org/web/20220518100109/http://twtxt.xyz/)
