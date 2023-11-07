---

title: Thoughts on GoAccess
draft: false
cover_image: /img/featured-images/thoughts-on-goaccess.png
tags:
  - Tools and Resources
  - GoAccess
  - Sysops
  - Server Toolchain
growthStage: budding
---

Recently I upgraded PHP on my web server to 7.1 and among the many speed improvements it brought, the upgrade did break the visitor log application [have-a-mint](https://haveamint.com/) that I have been using for many, many years.

For the time being I have switched to using Google Analytics, however the switch was relatively recent and I therefore do not have any historical data to compare year on year against. Fortunately I do have server logs that go back several years and therefore simply needed an analytics package to parse them into something more human friendly.

This is where [GoAccess](https://goaccess.io/) comes in, it initially caught my attention because it has a unique terminal interface and unlike similar applications such as [AwStats](http://www.awstats.org/) the HTML interface for GoAccess does not feel dated.

![GoAccess HTML Output](/img/thoughts-on-goaccess-2.png "GoAccess HTML Output")

Not only does GoAccess have a very usable terminal interface but both terminal and HTML interfaces can come with live update functionality with the later being provided via web sockets. Being able to load up a 200MB log file in about 70 seconds to an interactive application within your console is both impressive and useful. Even more so when you realise that it updates as the log file is written to!

![GoAccess Terminal Output](/img/thoughts-on-goaccess-1.png "GoAccess Terminal Output")

There are many benefits to using GoAccess; I have however stumbled into some of its current limitations, although given that GoAccess is primarily a tool to be used by system admins for nailing down web server issues may not be limitations to the majority of its users.

First and foremost I have a web access log that goes back four years, within have a mint it was nice to be able to compare this year month-by-month to last year month-by-month to see if I was improving, the same for last month and last 7 days. This sort of segmentation and comparison is also available within Google Analytics. However when I load the same log file into GoAccess it limits me to the last 365 days with no option to change the segment beyond piping the log into GoAccess via `grep` or `awk`.

![GoAccess Meaningless Graph](/img/thoughts-on-goaccess-4.png "GoAccess Meaningless Graph")

Additionally, and this is also most likely because I am using GoAccess in a way that is not its primary focus a lot of the graphs are somewhat meaningless. For example the referring sites section has a graph with all the records along its X axis. This makes the data meaningless and should have been limited to the top ten displayed as a pie chart.

![GoAccess Protocol Confusion](/img/thoughts-on-goaccess-3.png "GoAccess Protocol Confusion")

Finally in several sections the protocol that people used to request a file is listed as one of the tables columns, this means that for each file you can end up with multiple table rows. This behaviour may be useful for system admins. However when using GoAccess for analysing website traffic you want to see all requests to a file as one row regardless of protocol used. This would be improved by having one table row per file, with an accordion drop down to display a detailed view by protocol.

As a log parsing tool GoAccess is remarkably quick and it's terminal based display is impressive. However it lacks features that are useful for bloggers and its HTML interface while prettier than that provided by AWstats does need improvements. 

Beyond displaying the statistics, GoAccess does also provide raw json and csv output so it is entirely likely that someone could build an application upon that output to fill in the gaps. I do remember a long-since-abandoned tool called [JAWStats](http://www.jawstats.com/) which used the raw output from AWstats to provide an interface that is much nicer visually - it would be interesting to see someone do that for GoAccess.