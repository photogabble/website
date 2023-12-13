---
title: "Adding favicon"
tags: [Blogging]
growthStage: evergreen
---

Today I closed issue [#30: Add Favicon](https://github.com/photogabble/website/issues/30). This has embarrassingly been open since October 2021 after having rewritten PhotoGabble for 11ty.

In the history of this website, it has always had a favicon in the form of a `.ico` file loaded thus:

```html
<link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>
```

Up until 2018 I used [favicon.cc](https://www.favicon.cc/) to create favicons, then at some point I was shown [real favicon generator](https://realfavicongenerator.net/) which takes your source image and provides a zip file containing the assets required for different platforms.

I don't know when favicons became more complex than a single 16x16 icon file, however it is nice to have a tool that makes producing the array of files a relatively straightforward process plus the following html added to each page `<head>`:

```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#2b5797">
<meta name="theme-color" content="#ffffff">
```

I don't think anyone will be adding PhotoGabble to their home screen and given that context going from one LoC to seven feels a little wasteful. However, it's good practice doing the best possible.
