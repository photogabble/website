---
title: Graphing ping response times in Windows with GPING
tags:
  - Tools and Resources
  - Graphing
  - stage/budding
cover_image: /img/gping-graphical-ping-for-windows.png
---

![Graphing ping response times with gping](/img/gping-graphical-ping-for-windows.png "Graphing ping response times with gping")

The windows tool [GPING](http://sourceforge.net/projects/gping/) [^1] brought to you by naafay, is an incredibly useful tool for monitoring ping responses from multiple hosts over a period of time from five minutes to hours, days, weeks, months and beyond.

I happily stumbled upon GPING while looking to see if a desktop tool existed that would provide nice, detailed graphs of ping responses over time. During my search I did find alternative tools to GPING in the form of [Windows GUI Ping Utility](http://sourceforge.net/projects/pingutil/) which is unfortunately inactive, [Ping for life](http://sourceforge.net/projects/pingforlife/) which looked a little too complex and [TurboPING](http://sourceforge.net/projects/turboping/) which  looked a little too simple.

Compared to the alternatives GPING looks to be the most rounded and complete of the offerings; its usage of RRDTool graph output is a huge plus as well because it produces a beautiful yet to the point graph. Adding hosts for GPING to monitor is achieved by clicking the *add host* button and filling in the ipv4 address or alternatively by creating a txt file containing one i.p address per line and using the *import* button - although oddly enough GPING appears to be lacking an *export* button.

### Minor Issues

![gping application error](/img/gping-application-error.png "gping application error")

Given GPINGS rounded appearance it is sad to note that there is currently one bug and a few minor issues that hinder its appeal, these affect its ability to save graph data while hosts are being pinged, every time I attempt to do this I get the above application error usually resulting in having to restart GPING to get graphing working again and thus loosing all previously collected data points. However if you configure the save location before you tell GPING to start pinging hosts it saves the first time with no problem, but the next time will result in an application error.

Finally while you *can* stop and start GPING pinging hosts, there is no pause and when you restart pinging via clicking the *stop* button followed by the *start* button the graph data is erased.

### Closed Source?

When I saw that GPING is hosted on source forge I was hopeful that I might find the source and be able to write a patch to fix the aforementioned issues but it appears to be closed source which is unfortunate.

### Overview

Overall GPING is the best offering that I have come across to ping multiple hosts and provide graphical representation of the data through the use of RRDTools on Windows[^2]; even though it has some odd behaviour in certain areas it works well enough to be the best solution for now.

[^1]: Not to be confused with similar tools by the same name found [here](http://www.gping.com/) and [here](https://github.com/mastahyeti/gping)
[^2]: There are some nice alternatives for Linux
