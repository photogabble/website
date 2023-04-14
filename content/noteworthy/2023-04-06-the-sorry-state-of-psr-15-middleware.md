---
title: "The sorry state of PSR-15 Middlewares"
tags: [Tuppence, PHP, MicroFramework, PSR-7]
growthStage: seedling
---

I have spent some time this week tinkering with [[Tuppence]] and in doing so contemplating the sorry state of PSR-15 Middlewares.

As a #MicroFramework, Tuppence only provides three things: a PSR-11 Dependency Injection Container provided by [league/container](https://container.thephpleague.com/), a PSR-14 Event Handler provided by [league/event](https://event.thephpleague.com/3.0/) and a PSR-7 Routing and Dispatching component implementing PSR-15 middleware provided by [league/route](https://route.thephpleague.com/).

My thinking at the time of its creation in 2017 was that these three elements would be enough to form a core around which anyone could easily attach PSR-* compliant modules to build their applications to _their_ liking. This was a time when [The League of Extraordinary Packages](https://thephpleague.com/) was in the limelight, as was the [PHP-FIG](https://www.php-fig.org/) and it felt as though a new implementation of one of the PSR specs was announced weekly.

That velocity it seems wasn't sustainable and in the years since and especially with the dominance of Laravel and Symfony a lot of the #PHP ecosystem has begun to feel like a [dead mall](https://en.wikipedia.org/wiki/Dead_mall).

—

It could be that I am out of the loop and not mingling enough with people in the PHP ecosystem or at least not as much as I used to five years ago but it seems prominant projects from back then have become a lot less active now, or at the very least a lot less noisy about what they are doing.

I recently dusted off Tuppence to use it as a foundation for teaching various areas of complexity that Laravel wraps in a comfortable to use facade and upon looking for various PSR-15 middlewares via the excellent [awesome PSR-15 Middlewares project](https://github.com/middlewares/awesome-psr15-middlewares) I was a little disappointed to find a great many had not been touched by their authors in several years.

Now it could be said that a lot of these middlewares can be considered [[what finished looks like|finished]] however it's still unsettling to be using something that may no longer be maintained.