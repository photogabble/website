---
title: Colour
description: A lightweight toolset for colour manipulation, ported from polished.js
git: https://github.com/photogabble/colour
categories:
    - abandoned
language: Go
---

While writing [Go Pixels Fight!](https://github.com/photogabble/go-pixel-fight) I needed to be able to mix two colours to produce an average of the two to show which colour was winning; during my research I stumbled upon the _color_ helpers in [polished.js](https://github.com/styled-components/polished) and while they didn't work for what I needed I thought it would be useful to myself in the future and others if they were ported to Go.

Primarily as a learning exercise in how to write tests with Golang I release this port to the wild in the hope that it may be of some use to someone.