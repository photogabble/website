---
title: If DOS Game Dev is a rabbit hole then call me Alice
draft: false
categories:
    - thoughts
featured: true
---

The title for this article was first written in January 2021 soon after a week long deep dive into vintage computing and retro coding. The fact that I didn't begin writing the body of this article until December 2021 speaks volumes about how hectic 2021 was and how little of what I had aspired to complete in January of that year got done.

## Seeking Thinking Sand

In January, after dropping deep into the rabbit hole that is Roguelike games and their development; I discovered the joy that is retro-programming[^1] and the somewhat tight-knit community that surrounds it.

Soon afterwards I ended up with the notion that it would make for an interesting project if I were to buy a vintage computer and then develop a game in Windows 10 with DOSBox as emulator to eventually be compiled and run on vintage hardware directly.

This resulted in several long afternoons spent trawling eBay vintage hardware for an ideal computer. I don't have space for, nor want to risk shipping a big CRT and so the larger systems where excluded, and I narrowed my focus towards luggables. 

Nothing makes a project more interesting than challenge and if you think developing for vintage hardware using modern day systems isn't challenging enough then hold my double espresso because I went one extra and decided anything 286 and above was too modern.

Within the vintage computing community there are thriving groups of enthusiasts for Commodore, Acorn and ZX Spectrum computers. A result of this is that there are a lot of projects for 6502 and Zilog Z80 processors. While this would have given me a large pool of knowledge to dip into I wanted to do something that fewer living people had done before. To that end my focus narrowed tighter still on to the Intel 8080 and 8086 processors.

In the end I found the Toshiba T1200 portable to be my ideal hardware platform. It's powered by the 16-bit Intel 8086 with 1MB of RAM, CGA graphics and in the case of the unit I bought, DOS 3.1 loaded from ROM, 1 x 1.44 720K floppy drive and a working 30MB hard disk[^2].

## Narrowing down the problem

With the hardware sorted my focus turned to how I was going to program a game using my modern Windows 10 computer. I didn't fancy learning a great deal of 8086 ASM and instead began looking for C/C++ compilers that could target 16-bit DOS.

This actually proved to be the most difficult part of this whole endeavour until now because I didn't really know _what_ I was looking for. After spending the majority of a few weeks worth of afternoons researching I happened upon Open Watcom.

In case you're unaware, Open Watcom C/C++ is an open source release of the Watcom IDE. Before being released under an open source licence, Watcom C/C++ was commercial software during the time period when my hardware of choice was a viable compile target. Better still Open Watcom is still being developed by an active community and has builds that run on Windows 10 while retaining its ability to target 16-bit DOS.

At this point I now have physical hardware to develop for, a modern-ish toolchain and thanks to DOSBox an easy-to-use development environment for quickly testing builds without having to constantly transfer and run on my vintage hardware.

## Unearthing decades old documentation

Now that I had a viable development environment I needed to learn how to draw graphics to the screen and because my target hardware only supports CGA graphics that is what I needed to learn. Except it wasn't all that easy because a lot of the documentation isn't available online, or where it once was it has since been removed. I ended up reading through lecture notes from a university course taught in the 90s which finally helped things click into place.

A lot of the problems I faced in finding out how things worked was not knowing the correct thing to search for.

[^1]: There is something poetic about programming for systems long obsolete where documentation has not been digitised and knowledge has long since been buried in the Earth.

[^2]: I will be writing more about this in the future, suffice to say I am happy the computer works and even more happy when I found the hard disk to have Windows 3.0 installed on a second partition!