---
title: "Adding enhanced opengraph meta"
tags: [Blogging]
growthStage: evergreen
---

September seems to be this website's month of catching up with old issues; I have just closed two:

- [#85 Enhance social sharing meta](https://github.com/photogabble/website/issues/85)
- [#119 Add OpenGraph data for image cards](https://github.com/photogabble/website/issues/119)

I'll focus on the enhanced social sharing meta ([#85](https://github.com/photogabble/website/issues/85)) to begin with. Previously this websites [opengraph meta](https://ogp.me/) was limited to the below: 

{% raw %}
```html
<meta property="og:title" content="{{ title or metadata.title }}">
<meta property="og:type" content="{{ ogtype or 'website' }}">
<meta property="og:url" content="{{ metadata.url }}{{ page.url }}" />
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@carbontwelve">
<meta name="twitter:creator" content="@carbontwelve">
<meta name="twitter:title" content="{{ title or metadata.title }}">
```
{% endraw %}

In the context of the previous version of PhotoGabble this is weirdly limited because prior to the rewrite I had the full complement of opengraph data for articles as well as social image cards.

Therefore, for what feels like the fourth time in the history of rebuilding this website I refactored the above into:

{% raw %}
```html
<meta property="og:locale" content="en_GB"/>
<meta property="og:site_name" content="{{ metadata.title }}"/>
<meta property="og:title" content="{{ title or metadata.title }}"/>
<meta property="og:type" content="{{ ogtype or 'website' }}"/>
<meta property="og:url" content="{{ metadata.url }}{{ page.url }}"/>

<meta name="twitter:card" content="summary"/>
<meta name="twitter:site" content="@carbontwelve"/>
<meta name="twitter:creator" content="@carbontwelve"/>
<meta name="twitter:title" content="{{ title or metadata.title }}"/>

{% if ogtype === 'article' %}
    <meta name="twitter:label1" content="Words"/>
    <meta name="twitter:data1" content="{{ readingTime.words }}"/>

    <meta name="twitter:label2" content="Est. reading time"/>
    <meta name="twitter:data2" content="{{ readingTime.time }}"/>

    <meta name="article:published_time" content="{{ published_time }}"/>
    <meta name="article:modified_time" content="{{ modified_time }}"/>
    <meta name="article:expiration_time" content="{{ expiration_time }}"/>

    {% if contentType %}
        <meta name="article:section" content="{{ contentType }}"/>
    {% endif %}

    {% for tag in tags %}
        <meta name="article:tag" content="{{ tag }}"/>
    {% endfor %}
{% endif %}
```
{% endraw %}

## Dynamic Opengraph images

Closing [#119](https://github.com/photogabble/website/issues/119) took a lot more work than I expected. First I needed to understand how to create dynamic social media share images; there are a lot of tutorials available but, ultimately I took pieces from the following three:

- [Michael Harley's tutorial on automating social sharing images with Eleventy and Puppeteer](https://obsolete29.com/posts/2021/01/09/automated-social-sharing-images-with-eleventy-and-puppeteer/)
- [Joy of Code: Dynamic Social Share Images](https://joyofcode.xyz/dynamic-social-share-images)
- [Stephanie Eckles tutorial on automated Social Sharing Images with Puppeteer, 11ty, and Netlify](https://dev.to/5t3ph/automated-social-sharing-images-with-puppeteer-11ty-and-netlify-22ln)

I knew I wanted to have a command that I could run separate from 11ty to generate social share images and to use HTML templating. Both Stephanie and Michael's solutions use [Puppeteer](https://pptr.dev/) to control a headless installation of chrome in order to capture screenshots of html templates. This made most sense to me, and so I followed a combination of their instructions.

I have written up a detailed guide on my solution (see [[Using Puppeteer with 11ty to automate generating social share images]]) but suffice to say it required modifying aforementioned `<head>` code with the below:

{% raw %}
```html
{% if ogImageHref %}
<meta property="og:image" content="{{ ogImageHref }}">
<meta name="twitter:card" content="summary_large_image"/>
{% else %}
<meta name="twitter:card" content="summary"/>
{% endif %}
```
{% endraw %}