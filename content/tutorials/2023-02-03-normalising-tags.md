---
title: Normalising Tags
tags: ["11ty"]
growthStage: stub
---

## Preface

There is [some discussion](https://github.com/11ty/eleventy/issues/2462) regarding case sensitivity with tags. In my opinion tags should be insensitive to case but also presented in a human way. For example "ToolsAndResources" should become the slug "tools-and-resources" but display as "Tools And Resources". There are of course exceptions to this: "JavaScript" for example is one word and "PHP" should always remain capitalised. There is also the case where "GameDev" and "GameDevelopment" should be considered the same with both linking to the same destination.

These cases make normalising tags for human readability a difficult problem but not insurmountable.

## Todo

This post should be linked to from "How to programmatically add tags to posts".