---
title: "Blogtimes: A trip down memory lane"
tags:
  - PHP
  - Blogtimes
growthStage: budding
---

![blogtimes.png, a histogram view of blog posts by hours of the day over the past 30 days](/img/blogtimes.png)

Many years ago, during a previous incarnation of this website I displayed the above histogram representation of blogs posted by hour of the day over the past thirty days. I was reminded of this recently when the topic of blogging came up in conversation. I could remember originally getting the idea from Matt Mullenweg's blog over a decade ago but not the exact timeframe, nor could I remember what the code was named.

In doing so I had nerd sniped myself! So began a short trip down a deep rabbit hole!

Remembering that I did at some point host my own version of this histogram I searched month by month within the Wayback Machine's archive of my blog before [finding it](https://web.archive.org/web/20060330180503/http://www.photogabble.co.uk/) on a page from 2006.

At this point, I should have dug my way out of the rabbit hole and continued with my day, but that is not how nerd sniping works. I needed to find out more about the code behind the graph. I now knew the graph the code produced was called `blogtimes.png` and from this I assumed the code behind it was called _Blogtimes_. With that knowledge in hand I then turned to Matt Mullenweg's present day website [ma.tt](https://ma.tt) and knowing it's WordPress added `?s=blogtimes` to the url to search his archive for what I was looking for.

Fortunately Matt has kept an archive of all his old posts, this helped me quickly find his short post from January 2003 titled [PHP Blogtimes for b2](https://ma.tt/2003/01/php-blogtimes-for-b2/). Unfortunately the sands of time have resulted in two out of the three links now going nowhere with the third surprisingly being [cafelog.com](http://www.cafelog.com): the home page for b2.

Returning to the Wayback Machine, I was eventually able to retrieve the [project page](https://web.archive.org/web/20030207111016/http://nilesh.org/mt/blogtimes/) for _the_ original version of Blogtimes written by Nilesh Chaudhari for MovableType. In addition, I also found Nilesh's [blog post](https://web.archive.org/web/20030803022521/http://nilesh.org/weblog/2002/11/29/mtblogtimes.nc) which contains a number of interesting to read comments from the blogging community.

To my upmost surprise and delight the Wayback Machine also stored a copy of the [mtblogtimes-1.0.zip](https://web.archive.org/web/20030803022521/http://nilesh.org/mt/blogtimes/mtblogtimes-1.0.zip) [^1] linked from the aforementioned project page and so for the first time in over a decade I had the perl source code to something that has been itching away in the back of my mind for almost as long!

Alas, this wasn't the bottom of the rabbit hole. My original goal was to find the PHP version that Matt mentioned and which I had myself used all those years ago. I had to keep digging, the Wayback Machine had been incredible help, but now I needed to search the internet.

Having discovered from the zip archive that the perl source file is called `blogtimes.pl` I did a quick search for `blogtimes.php` and the [first result](http://limedaley.com/pipermail/plog-svn/2007-March/007386.html) landed me on the archive page for a mailing list showing messages from 2007:

```
plugins/branches/lifetype-1.2/blogtimes/pluginblogtimes.class.php
plugins/branches/lifetype-1.2/sitemap/pluginsitemap.class.php
plugins/branches/lifetype-1.2/tagcloud/plugintagcloud.class.php
```

The top line from the above got me excited and after reading a little further down I saw:

```
     /**
      * Plugin that offers blogtimes for current blog
      * Original Author: Matt Mullenweg http://photomatt.net
```

Unfortunately however, this was just a mailing list and the code snippets displayed are simply svn patch format.

Having spent a good number of hours on this escapade[^2] I noticed the sun had begun setting. This could only mean one thing, I needed to stop digging and make myself some coffee. One _shouldn't_ go digging around the internet without _some_ form of sustenance.

While brewing a pot of coffee it struck me that the svn patch was for a project called _LifeType_ and as soon as my coffee had brewed I returned to my desk, mug in hand, and began my search for that project.

LifeType appears to have been a blogging engine last updated in 2013; some digging uncovered the last [version 1.12.11 of LifeType available on SourceForge](https://sourceforge.net/projects/lifetype/files/lifetype/lifetype-1.2.12/). It felt like I was getting close to my answer however browsing the `plugins` directory resulted in disappointment. Of course, it wouldn't be bundled with the main application, it's a plugin!

The next problem now was where to find a list of the available plugins from? The projects' website lifetype.net was now long since dead, fortunately the Wayback Machine is a thing and thanks to its archive I quickly discovered the projects' [development page](https://web.archive.org/web/20070208222752/http://www.lifetype.net/blog/lifetype-development-journal/page/development) and on it the structure of their svn repository (copied below,) that I recognised from the mailing list post (which at the time was hosted at `devel.lifetype.net`.)

```
plog/
     plog/
          branches/
          tags/
          trunk/
     plugins/
             branches/
             tags/
             trunk/
     templates/
               branches/
               tags/
               trunk/
```

It is fortunate that Lifetype's svn repository was published using Apache Subversion because that resulted in a [somewhat complete copy of Lifetypes's entire svn repository tree being available from the Wayback Machine](https://web.archive.org/web/20151110143907/http://devel.lifetype.net/svn/plog/)!

Excitedly I navigated to  `/plugins/branches/lifetype-1.2` within the archived svn listing and could see `blogtimes` listed. Finally, a "quick" afternoon search that had dragged into the late evening had an end in sight, light at the end of the tunnel, land ahoy! Clicking the blogtimes link would take me to the original source, the holy grail of this nerd sniped deep dive, except: _Hrm. The Wayback Machine has not archived that URL._ My heart sunk, the coffee pot brewed, somewhere off in the distance foxes screamed in the moon lit darkness.

Not to be dissuaded I returned to SourceForge and had a bit of a more detailed poke around. I am glad that I did because after a while I found they had all the plugins listed in their svn respository zipped up and available for download from [here](https://sourceforge.net/projects/lifetype/files/lifetype-plugins/lifetype-1.2/)!

With that I downloaded [1.2_blogtimes.zip](https://sourceforge.net/projects/lifetype/files/lifetype-plugins/lifetype-1.2/1.2_blogtimes.zip/download)[^3] my quest was complete. This wasn't the original WordPress plugin by Matt but the `pluginblogtimes.class.php` within seems to largely be Matts code.

My coffee mug empty, `1.2_blogtimes.zip` safely in my download folder and my curiosity finally satisfied I headed to bed. I'll discuss unpacking `pluginblogtimes.class.php` and porting it to JavaScript for use with 11ty in a future post.

[^1]: [Mirrored copy of mtblogtimes-1.0.zip](/files/mtblogtimes-1.0.zip)
[^2]: an act or incident involving excitement, daring, or adventure. - Oxford English Dictionary
[^3]: [Mirrored copy of 1.2_blogtimes.zip](/files/1.2_blogtimes.zip).