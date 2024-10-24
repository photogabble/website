---
title: Adding Emoji support to your website or project
tags:
  - JavaScript
  - Emoji
  - stage/budding
cover_image: /img/emoji.png
---


Back in April this year I came across [this post](http://blog.farrant.me/adding-emoji-support-to-any-website/) by Josh Farrant detailing how to add support to any website for Unicode Emoji characters with [twemoji](https://github.com/twitter/twemoji) and given the [sad state](http://caniemoji.com/) of emoji support in popular browsers at present having a cross-browser polyfill available for the time being is a good thing. However, when writing posts I tend to use sublime text or nano via remote shell and in neither case do I have access to Unicode emoji input so I bookmarked Josh's post and largely forgot about it. 

Last week while researching in browser markdown editors I discovered [markdown-editor](https://github.com/jbt/markdown-editor) by James Taylor and upon viewing the projects [online demo](http://jbt.github.io/markdown-editor/) and seeing an emoji in the preview I had wondered if it was the same method that Josh had documented on his blog. After a quick browse of the source code I soon discovered that James is using another library called [emojify.js](http://hassankhan.me/emojify.js/) by Hassan Khan and the library converts Emoji keywords to images rather than the Unicode characters[^1].

With emoji.js you can the text `:+1:` within your page and emoji.js will convert it to :+1: by using the following code:

```javascript
<script>
    emojify.run();
</script>
```

By default emoji.js will not convert the content of `script`, `textarea`, `a`, `pre` and `code` tags so you do not need to worry that installing it will unintentionally break things and you can pass in a DOM element to emojify's `run` method to limit the area that it targets like so:

```javascript
<script>
    emojify.run(document.getElementById('articleContent'));
</script>
```

I would not recommend the over use of emojis on any website, however they can in certain cases add additional meaning or emphasis to a body of text and if nothing else do add a certain degree of fun to the page and with libraries such as emoji.js and twemoji there is now tools available to bring them to your website.

[^1]: It would be nice if there were one library that did both...
