---
title: "Thinking about #DOScember 2022"
tags: ["DOS", "DOScember"]
growthStage: seedling
---

Early in 2021 I attempted to take part in the [DOS Games Spring Jam 2021](https://itch.io/jam/dos-games-spring-jam-2021) with my enhanced version of the Usborne Space Mines game. However, due to extreme work conditions I was unable to complete my project, and it remained dormant on my laptop until December the same year when I discovered the #DOScember hashtag on Twitter.

I attempted to dust off the dormant project but starting late into the month and without proper planning was a recipe for failure. I was reminded of this while reviewing my notes in Obsidian and have decided to give #DOScember another go this year but with better planning and a defined scope.

## Theme

In the months since my last attempt, Space Mines (the game forever stuck in the back of my mind,) has erupted once again in the form of a Vue+PHP browser game in [[php-space-mines-introduction]]. Therefore, I am unsure if I should continue with my idea of writing an enhanced (think [EGA Trek](https://www.youtube.com/watch?v=BtxF0qYKIBg), or [Drug Wars](https://www.youtube.com/watch?v=Pt-fEXYyXP0)) version of Space Mines or if I should do something else.

If I choose to do something else, then what?

## Constraints 

Having just purchased my Toshiba T1200 at the time I wanted to use it as the projects' hardware constraint:

- 16-bit 8086 processor @ 9.54 MHz
- 1MB RAM
- 720KB FDD
- 640×200 CGA Graphics

In order to program for those constraints I used [Open Watcom C/C++](https://en.wikipedia.org/wiki/Watcom_C/C%2B%2B) and DOSBox for local testing. It very quickly became apparent to me that with some compile flags I could compile my game to run on Windows 10 as well as 16-bit DOS. This trick was to become the USP of my project, especially with either version then being able to run in the browser also!

I still believe these constraints to be valid and as such will continue to be bound by them.

## Development

When I first attempted this project I was using an aging IBM Thinkpad for 2012 and Open Watcom as the compiler. I now work on a MacBook Pro and so development will likely be within a [FreeDOS](https://www.freedos.org/) VM. I do like the idea of using the Turbo C IDE/compiler directly. This is something I need to spend more time thinking about.

If I hadn't made having the program run on actual vintage hardware a requirement I would use [QB64](https://qb64.com/) (maybe next time.)

In any case, I need to spend some time over the coming weeks to plan out the theme, and what I ultimately wish to achieve this year in order to consider it a success.

This [[Growth|seedling]] will be updated in due course with my planning.