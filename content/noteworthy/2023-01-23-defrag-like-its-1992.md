---
title: "Defrag like its 1992"
tags: ["DOS", "Retro Computing"]
growthStage: budding
---

> If you let it run to completion your web browser will run slightly faster for a while.
> — [lorddimwit](https://lobste.rs/s/cuoth6/windows_95_defrag_simulator_makes_noise#c_9n4zts)

The first computer that I owned was a second hand [[Toshiba T5100]] luggable saved from recycling by a friends father; being securely disposed it came without its original 40MB Hard Drive and so everything I did was via 3.5" floppy disks.

This didn't stop me from using the [MS-DOS `defrag` command](https://www.computerhope.com/defrag.htm) and spend longer than reasonable watching it do its thing; I did however learn quickly that turning the computer off while its working would corrupt the disk.

I had forgotten that memory until stumbling upon this [hacker news post titled: Defrag like its 1992](https://news.ycombinator.com/item?id=29585654) way back in December of 2021 ()[^1].

> **INSERT IMAGE FROM https://defrag.shiplift.dev/**

[Defrag - By ShipLift LLC](https://defrag.shiplift.dev/) as pictured above gives me a nostalgic sense of satisfaction, it's akin to a kinetic sculpture or those flowing sand paintings; useless, yet nice to look at.

> **INSERT IMAGE FROM https://codepen.io/manz/pen/MdErww**

In the years since I first saw this I have found a handful of others: [J. Román ( **Manz** )](https://manz.dev/) created a more [faithful reproduction of the MS-DOS `defrag` command available on codepen](https://codepen.io/manz/pen/MdErww) it gives me the same amount of joy as the version by Andrew LeTourneau and Conner McCall from ShipLift LLC but gets extra points for being closer to the memory I have of running defrag on my Toshiba.

> **INSERT IMAGE FROM [internet archive](https://web.archive.org/web/20170312133201/http://hultbergs.org/defrag/)**

The last computer I personally ran defrag on was running Windows98; I found this five year old [lobsters post titled Windows 95 Defrag Simulator (makes noise)](https://lobste.rs/s/cuoth6/windows_95_defrag_simulator_makes_noise) however the domain is no longer active and has in the years since been squatted. Once again the [Wayback Machine](https://archive.org/web/) comes to our rescue with an [archived copy of their Windows 95 Defrag Simulator](https://web.archive.org/web/20170312133201/http://hultbergs.org/defrag/).

I'm unsure why but this one doesn't render correctly on my computer, it does enough that you can see the simulation even though it appears to be simulating erasing data rather than repositioning it.

Out of the three simulations I found this one is the only one to have HDD activity noise, albeit a recording on loop, it does add something, however it's a little disappointing that it's not synthesized based on simulated disk activity.

Late last year I created a partial simulation of the Windows98 windowing system that utilised [98.css](https://jdan.github.io/98.css/) for that authentic Windows98 aesthetic. It might make a nice tinker project to reproduce the Windows98 defrag window using that[^2].

[^1]: This post has had an open issue: [Issue #53: Defrag like its 1992](https://github.com/photogabble/website/issues/53) for over a year before I got round to actually writing this...
[^2]: It's only taken me two years to complete this post, so I expect two to five years from now I will have written my own simulation!