---
title: LDPL Space Mines
description: Command Line Space Mines Simulator Game ported from BASIC to LDPL
git: https://github.com/photogabble/ldpl-space-mines
status: tinkering
language: LDPL
---

This is a port to LDPL of a BASIC strategy/management game called Space Mines. The BASIC code was originally published in 1982 in an Usborne book titled [Computer Space-games](http://www.worldofspectrum.org/infoseek.cgi?regexp=^Computer+Spacegames$&loadpics=1). In the same year the game was released on tape for the ZX Spectrum 16K, [click here](http://www.worldofspectrum.org/infoseekid.cgi?id=0019122) for more information and a download link to the Spectrum tape image.

[LDPL](http://ldpl.lartu.net/) is a very simple interpreted programming language that mimics older languages like COBOL. Its author Martín del Río designed it from the ground up to be excessively expressive, readable and easy to learn.

You can obtain the LDPL interpreter from [here](https://github.com/Lartu/ldpl/releases) and once in your `$PATH` run the game by running `ldpl spacemines.ldpl`.

```
==================================================
YEAR 1:

There are 44 people in the colony.
You have 3 mines, and $1982
Satisfaction Factor 1

Your mines procuced 57 tons each.
ORE IN STORE=171 tons.
==================================================

SELLING
Ore selling price: 10
Mine selling price: 2999/mine
How much ore to sell? 171
How many mines to sell? 0

You have $3692

BUYING
How much to spend on food? $3500
Buying $3500 food
How many mines to buy? 0
```

The aim of the game is to survive 10 years in office; the original printed source contains variables for total amount of food and food price. However it doesn't actually use them.

Scanned copies of the original BASIC source can be found in [my porting of the game to Go here](https://github.com/photogabble/go-space-mines).

Enjoy.