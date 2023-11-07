---
title: Is rubber ducky debugging using sods law as a debugging tool?
tags:
  - Programming
cover_image: /img/rubber-duck-programming.png
growthStage: evergreen
---

> While Murphy's law says that anything that can go wrong, will go wrong (eventually), Sod's law requires that it always go wrong with the worst possible outcome.
> &ndash; [Wikipedia](http://en.wikipedia.org/wiki/Sod%27s_law)

Murphy's law[^1] and programming go hand in hand, given that good enough isn't &ndash; unless there is a deadline and deadlines are part and parcel with big software projects then there will always be the chance for bugs, missing functionality and dumb users.

Of sods law, I think Richard Dawkins sums it up nicely when he says: *"when you toss a coin, the more strongly you want heads, the more likely it is to come up tails,"* something I have found to be true many times during rubber ducky sessions. For those of you unaware, rubber ducky debugging[^2] is a method  of debugging where you use an inanimate object (traditionally a rubber duck of the bathtub variety) to anthropomorphize and explain in detail what your code is doing line by line. At some point during your explanation sods law will come into effect and you will realise that the line of code you are explaining isn't working as you expect and you therefore discover the source of your bug.

Given sods law requires that when something goes wrong, it will go wrong with the worst possible outcome it can be argued that using a colleague in the place of the inanimate object will increase your chance of finding the cause of your issue even if all they do is stand there serenely, happy in the knowledge that they have helped in some small way while providing near zero input which is what distinguishes this method from pair programming.

Then again both Murphy's law and Sod's law come into effect when pair programming, usually in the case of you both scratching your head until a colleague absent-mindedly passes by and points out something obviously wrong that neither of you noticed.

<small>The rubber duck image used as the thumbnail for this article was taken by Tom Morris and is licensed CC BY-SA 3.0, available [here](https://en.wikipedia.org/wiki/Rubber_duck_debugging#/media/File:Rubber_duck_assisting_with_debugging.jpg).</small>

[^1]: [Visit here](http://www.murphys-laws.com/murphy/murphy-computer.html) for a list of all laws of Murphy in one place
[^2]: As far as I am aware the term was coined by Andrew Errington in November 2002 on the Univeristy of Canterbury Linux Users Group, [click here to view the archived message](http://lists.ethernal.org/oldarchives/cantlug-0211/msg00174.html)
