---
title: Go Space Mines
description: Command Line Space Mines Simulator Game ported from BASIC to Go
git: https://github.com/photogabble/go-space-mines
status: tinkering
language: Go
---

This is a port to Go of a BASIC strategy/management game called Space Mines. The BASIC code was originally published in 1982 in an Usborne book titled [Computer Space-games](http://www.worldofspectrum.org/infoseek.cgi?regexp=^Computer+Spacegames$&loadpics=1). In the same year the game was released on tape for the ZX Spectrum 16K, [click here](http://www.worldofspectrum.org/infoseekid.cgi?id=0019122) for more information and a download link to the Spectrum tape image.

Build using `go build` and then execute, you will be presented with output like so:

```
Year 1
There are 47 people in the colony
You have 4 mines and $ 799
Satisfaction Factor  1

Your mines produced  47 tons each
Ore in store: 188 tons
Selling:
Ore selling price: $ 9 /ton
Mine selling price: $ 3487 /mine
How much ore to sell? 188
How many mines to sell? 1

You have $ 5978

Buying
How much to spend on food? (Appr. $100 EA.) 2000
How many more mines to buy? 0
```

The aim of the game is to survive 10 years in office; the original printed source contains variables for total amount of food and food price. However, it doesn't actually use them.

I have included scanned copies of the original source for [page 24](https://github.com/photogabble/go-space-mines/blob/master/doc/isaaman-24.png) and [page 25](https://github.com/photogabble/go-space-mines/blob/master/doc/isaaman-25.png) of the book this game was published in.
