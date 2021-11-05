---

title: The QB64 programming language
draft: false
cover_image: /img/featured-images/introducing-the-qb64-programming-language.png
categories:
    - programming
tags:
    - basic
    - quick basic
    - retro
header:
    background:
        color: "#000144"
---

Writing my [happy 53rd birthday to BASIC article](/blog/2017/05/02/happy-fiftyth-birthday-basic) brought up fond childhood memories of programming on my Toshiba T3100e. As a teenager I often spent the evenings basking in the orange glow from its plasma display and tapping away at its keyboard, entering programs into my copy of Quick Basic.

![GORILLA.BAS](/img/introducing-the-qb64-programming-3.png "GORILLA.BAS")

It has been almost fourteen years since I first wrote in BASIC and serendipitously after having published my happy birthday tribute to a language that shaped a large part of my life I stumbled upon the [twitter account](https://twitter.com/QB64team) for a modern revival called QB64.

While I never used Quick Basic on a colour monitor, QB64 with its familiar IDE interface brings back nostalgic memories of a time when I first got the programming itch.

## So what is QB64, and what can you do with it?

QB64 is a modern extended BASIC programming language that impressively retains 95-98% compatibility for QB4.5 and QBASIC[^1].

While that on its own is impressive enough, [QB64](http://www.qb64.org/) goes several steps further by also being able to compile native binaries for Windows, Linux and macOS. This makes it entirely possible to load source code you wrote decades ago and have it run, natively, on any one of the three supported platforms with little to no modification.

On top of having backwards compatibility with older source code QB64 also provides access to modern features such as TCP/IP, graphics, sound, screen capture, TTF fonts and clipboard access. All while retaining the same look and feel as the original Quick Basic IDE.

[![QB64 GUI by Fellippe Heitor](/img/introducing-the-qb64-programming-2.png "QB64 App by Fellippe Heitor")](https://twitter.com/FellippeHeitor/status/816702804874166276)

There is an active community of developers both developing for and with QB64. A chap named [Fellippe](https://twitter.com/FellippeHeitor) has even gone so far as to port some of [Daniel Shiffmans](https://twitter.com/shiffman) p5.js code examples to QB64 implementing an impressive GUI with a QB64 tool he also authored called [InForm](https://github.com/FellippeHeitor/InForm).

While on the subject of p5.js, a Github user by the name of AshishKingdom has recently begun porting p5.js to QB64 in the form of [p5js.bas](https://github.com/AshishKingdom/p5js.bas). That repository has a number of samples showing the framework functioning, including some ports of p5js sketches. This is an impressive achievement and goes to show how active the community surrounding QB64 is, further evidenced by the extremely active [forum](http://www.qb64.net/forum/index.php).

[![Racing Game by Kay Lerch](/img/introducing-the-qb64-programming-4.png "Racing Game by Kay Lerch")](https://twitter.com/KayLerch/status/758773390052392960)

A quick search of twitter provided me with some tasty screenshots for this article, namely the above racing game originally written in 1998 on a 80386 by Kay Lerch.

> _The code actually is creepy as hell and there are more bugs than features in it. But somehow these little peaces of software are sweet memories and serious teenage expressions ;) I even found code which insults a player when entering my brother's name ^^_

The phrase _"...sweet memories and serious teenage expressions..."_ resonates with me and is similar to the sentiment I have when remembering my own BASIC adventures. In providing a modern setting in which to re-experience those moments, QB64 has helped revive that feeling. You can view Kay's car racing code among several other games of his from those formative years in his [Github repository here](https://github.com/KayLerch/qbasic-teenage-masterpieces).

![QB64 - Miss Saigon and Whispers in the Moss (RPG)](/img/introducing-the-qb64-programming-5.png "QB64 - Miss Saigon and Whispers in the Moss (RPG)")

Aside from rebooting old BASIC and Quick BASIC projects from times of yore, QB64 is also being used to develop relatively recent projects, from games such as [Miss Saigon](https://greaterevil.itch.io/miss-saigon) and [Whispers in the Moss](https://retrowl.wordpress.com/whispers-in-the-moss/) to tools such as [this FTP client](https://github.com/mkilgore/qb64_ftp_client) (which admittedly has not been touched in four years).

QB64 has re-ignited a spark that I thought time had extinguished; I am certainly going to revisit some of my old code in the modernised IDE and tinker with some of the community developed tools.

If you would like to download and play with QB64, go visit the [official unofficial website here](http://www.qb64.org/) and share with the community your experience of Quick Basic and any old projects you manage to execute in the modernised IDE.

[^1]: [View this forum thread](http://www.qb64.net/forum/index.php?board=15.0) for a list of commands awaiting implementation and for reasons why certain commands cant be implemented.