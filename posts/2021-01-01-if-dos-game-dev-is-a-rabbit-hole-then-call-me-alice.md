---
title: If DOS Game Dev is a rabbit hole then call me Alice
draft: false
categories:
    - thoughts
featured: true
---

I wrote the title for this thought way back in January, which given that we are now in December of the same year speaks volumes about how hectic the year has been, but I shall leave that retrospective for another posting.

## Seeking Thinking Sand

In January, after dropping deep into the rabbit hole that is Roguelike games and their development; I discovered the joy that is retro-programming[^1] and the somewhat tight-knit community that surrounds it.

Soon afterwards I ended up with the notion that it would make for an interesting project if I were to buy a vintage computer and then develop a game in Windows 10 with DOSBox as emulator to eventually be compiled and run on vintage hardware directly.

This resulted in several long afternoons spent trawling eBay vintage hardware for an ideal computer. I don't have space for, nor want to risk shipping a big CRT and so the larger systems where excluded, and I narrowed my focus towards luggables. 

Nothing makes a project more interesting than challenge and if you think developing for vintage hardware using modern day systems isn't challenging enough then hold my double espresso because I went one extra and decided anything 286 and above was too modern.

Within the vintage computing community there are thriving groups of enthusiasts for Commodore, Acorn and ZX Spectrum computers. A result of this is that there are a lot of projects for 6502 and Zilog Z80 processors. While this would have given me a large pool of knowledge to dip into I wanted to do something that fewer people had done before. To that end my focus narrowed tighter still on to the Intel 8080 and 8086 processors.

In the end I found the Toshiba T1200 portable to be my ideal hardware platform. It's powered by the 16-bit Intel 8086 with 1MB of RAM, CGA graphics and in the case of the unit I bought, DOS 3.1 loaded from ROM, 1.44 720K floppy drive and a working 30MB hard disk[^2].

## Narrowing down the problem

With the hardware sorted my focus turned to how I was going to program a game using my modern Windows 10 computer. I didn't fancy learning ASM and instead began looking for C/C++ compilers that could target 16-bit DOS.

This actually proved to be the most difficult part of this whole endeavour until now because I didn't really know what I was looking for. After a few weeks of afternoons spent researching I happened upon Open Watcom. 

In case you're unaware, Open Watcom C/C++ is an open source release of the Watcom IDE. Before being released under an open source licence, Watcom C/C++ was commercial software in the time period of when my hardware of choice was a viable compile target. Better still Open Watcom is still being developed by an active community and has builds that run on Windows 10 while retaining its ability to target 16-bit DOS.

At this point I now have physical hardware to develop for, a modern-ish toolchain to compile with and thanks to DOSBox an easy to use environment to develop within.

[^1]: There is something poetic about programming for systems long obsolete where documentation has not been digitised and knowledge has long since been buried in the Earth.

[^2]: I will be writing more about this in the future, suffice to say I am happy the computer works and even more happy when I found the hard disk to have Windows 3.0 installed on a second partition!