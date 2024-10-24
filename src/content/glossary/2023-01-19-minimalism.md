---
title: "Minimalism"
tags: 
  - Programming
  - Methodology
  - stage/seedling
issueUri: https://github.com/photogabble/website/issues/208
---

In the early days of computing the resources available where slim and minimalism in programming was a part of the job. Nowadays with the explosion of **Moore's Law** and with it the prevalence of high speed thinking sand; outside specialist fields such as embedded applications, programmers can almost consider computing resource limitless.

This has however resulted in considerable [software bloat](https://en.wikipedia.org/wiki/Software_bloat) over the years, for example the Microsoft Calculator program: the version of `calc.exe` shipped with Windows XP weighed `112.0KB`[^1] whereas the version shipped with Windows 10 is many times bigger!

I am a big advocate of pragmatic minimalism in programming. What I mean by that is not to take it to the extremes of code-golf, instead its more about keeping a programs surface area small enough that the average developer can keep enough of it in working memory to be highly efficient.

There are many differing principles that aim to help, I have found both [KISS](https://en.wikipedia.org/wiki/KISS_principle) and [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principles help but as with all things there _are_ grey areas, and sometimes you need a [worse is better approach](https://en.wikipedia.org/wiki/Worse_is_better) at least in the beginning.

With ever-increasing vendor folders (`node_modules` I am looking at you,) the time of a programmer knowing all areas of a code base are quickly becoming a thing of the past. When was the last time you delved deep into the inner workings of [Eloquent](https://github.com/laravel/framework/tree/9.x/src/Illuminate/Database/Eloquent), or the [Symfony Console Component](https://github.com/symfony/console)? Increasingly I am seeing people treat these as black boxes, rarely delving deeper than what the documentation surfaces and hardly ever using a debugger like [xDebug](https://xdebug.org/) to peer up the call stack.

This "bloating" of third party code increases the surface area for both bugs and attack. _Yes_, we now have tools such as [npm's audit command](https://docs.npmjs.com/cli/v9/commands/npm-audit), [GitHubs Advisory Database](https://github.com/advisories) and the [automatic warnings when installing/updating packages with composer](https://php.watch/articles/composer-audit). These help, but they dont outperform not having so much extra code in the first place.

Strive for the most functionality from the least amount of code while maintaining readability. Remember, [the best code is no code at all](https://blog.codinghorror.com/the-best-code-is-no-code-at-all/).

[^1]: As listed at [Classic Calculator Extracted From Windows XP](https://archive.org/details/calc_exe_windows_xp/) at the Internet Archive
