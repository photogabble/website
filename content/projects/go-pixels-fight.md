---
title: Go Pixels Fight!
description: A Golang port of pixelsfighting.com
git: https://github.com/photogabble/go-pixel-fight
status: tinkering
language: Go
---

This ia port to Go of the JavaScript [Pixel Fighting](http://pixelsfighting.com/) simulation by [Jan Tewes Thede](https://twitter.com/jtthede). There are a few notable differences between Jan's version and my port, namely mine contains a positive feedback loop so that once one side begins to gain ground their velocity increases until a winner in found rather than oscillating between the two sides. Once a side has one the simulation resets and a fresh pair of colours are selected.

In addition to the above this port also includes a border around the _"battle field"_ that is shaded in preference to the winning side.