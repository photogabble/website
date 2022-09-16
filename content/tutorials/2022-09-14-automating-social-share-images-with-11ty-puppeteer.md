---
title: Using Puppeteer with 11ty to automate generating social share images
tags:
    - Programming
    - JavaScript
growthStage: evergreen
---

I recently added social sharing images to this website (see [[Adding enhanced opengraph meta]]) and initially found it difficult to find tutorials automating the process of image generation without using a paid for third party solution like [Dynapictures](https://dynapictures.com/).

Rik Schennink([@rikschennink](https://twitter.com/rikschennink/)) shared [how to generate social image covers with Eleventy and node-canvas](https://pqina.nl/blog/generate-social-image-covers-with-eleventy-and-node-canvas/). I liked Rik's solution for its simplicity however the idea of editing a social share image template in canvas felt complex and intimidating; I wanted to use something familiar, I wanted to use HTML + CSS.

Eventually I found similar solutions by [Michael Harley](https://obsolete29.com/posts/2021/01/09/automated-social-sharing-images-with-eleventy-and-puppeteer/) and [Stephanie Eckles](https://dev.to/5t3ph/automated-social-sharing-images-with-puppeteer-11ty-and-netlify-22ln), both using Puppeteer.

Overall the process is straightforward enough:

- have an `og-image.njk` template that makes use of 11ty's paginator to output one page per post; this is the template for the image
- have an `og-posts.njk` template that outputs a json file containing each posts slug and the location of each template as output by og-image.
- a standalone script run by npm that uses the json output by og-posts to pass each of the templates output by og-image through Puppeteer and saving the resulting image into an assets directory
- a filter added to 11ty that checks if a post's social image has been generated and returns its href for use by the main template to output og image meta tags.

In order for the standalone script to run, 11ty first needs to generate its required files, first I created `og-image.njk`:

{% raw %}
```html
---
pagination:
    data: collections.post
    size: 1
    alias: article
permalink: functions/_posts/{{ article.data.title | slugify }}/og-image.html
permalinkBypassOutputDir: true
eleventyExcludeFromCollections: true
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: sans-serif;
            background-color: #18181c;
            color: #e1dede;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 1280px;
            height: 640px;
            padding: 32px 48px;
        }
        .container{
            height:370px;
        }
        h1{
            font-size: 150px; 
            word-break: break-word; 
            word-wrap: break-word;
        }
    </style>
</head>
<body>
<div class="container">
    <h1 class="output">{{ article.data.title }}</h1>
</div>
<script>
    (function () {
        const output = document.querySelector('.output');
        const outputContainer = document.querySelector('.container');

        function resize_to_fit() {
            let fontSize = window.getComputedStyle(output).fontSize;
            output.style.fontSize = (parseFloat(fontSize) - 1) + 'px';

            if (output.clientHeight >= outputContainer.clientHeight) {
                resize_to_fit();
            }
        }

        resize_to_fit();
    })();
</script>
</body>
</html>
```
{% endraw %}

The snippet of JavaScript on the above was sourced from this [stack overflow answer](https://stackoverflow.com/questions/18229230/dynamically-changing-the-size-of-font-size-based-on-text-length-using-css-and-ht/64823041#64823041), it makes the font-size dynamic to the text being contained. This means the more text you have the smaller the font-size is set in order to fill the space.

Next `og-posts.njk` is created to output json thus:

{% raw %}
```html
---
title: "Open Graph: posts.json"
permalink: functions/_posts.json
permalinkBypassOutputDir: true
eleventyExcludeFromCollections: true
---
[{% for post in collections.post %}
    {
        "slug":"{{ post.data.title | slugify }}",
        "template":"functions/_posts/{{ post.data.title | slugify }}/og-image.html"
    }{% if not loop.last %},{% endif %}
{% endfor %}]
```
{% endraw %}

In both cases `permalinkBypassOutputDir` and `eleventyExcludeFromCollections` are set `true` in the files front-matter in order to output to the source folder rather than publishing them and to ensure the generated files are excluded from any collections.

Now when I run 11ty I see a newly created `functions/_posts.json` file and `functions/_posts` directory filled with html files for each post.

None of these files need to be committed to git, I then added the following to my `.gitignore`:

```gitignore
functions/_posts.json
functions/_posts
```

With the image source templates and their meta file created a new `create-og-images.js` file is placed in the `functions` directory:

```js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const makeImage = async (src, dist) => {
  const html = fs.readFileSync(src, 'utf8');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.setViewport({
    width: 1280,
    height: 640,
    deviceScaleFactor: 1
  });
  await page.screenshot({
    path: dist,
    quality: 70
  });
  await browser.close();
};

const fileReadable = (path) => {
  if (fs.existsSync(path)) return true;
  console.warn(`Unable to open: ${path}`);
  return false;
}

(async () => {
  try {
    let posts = require("./_posts.json");
    const promises = [];

    posts = posts.map((post) => {
      return {
        ...post,
        src: path.join(process.cwd(), post.template),
        dist: path.join(process.cwd(), `_assets/og-image/${post.slug}.jpg`),
      };
    }).filter((post) => !(fileReadable(post.dist) === true || fileReadable(post.src) === false))

    if (posts.length > 0) {
      process.setMaxListeners(posts.length + 10);

      posts.forEach((post) => {
        console.log(`Processing ${post.template}`);
        promises.push(makeImage(post.src, post.dist));
      });

      await Promise.all(promises);
    }
    console.log(`Completed processing ${posts.length} items`);
  } catch (e) {
    console.warn(e.message);
    process.exit(1);
  }
})();
```

When run via npm this script does the following:

- loops `functions/_posts.json` with array map and computes the template src and social image dist path names
- filters the mapped list of posts and excludes any entry where either src or dist do not exist
- setMaxListeners to 10 + the number of posts to generate images for, if zero bails early
- loops filtered list using array forEach padding src and dist values to `makeImage`.

The `makeImage` function is a short wrapper around Puppeteer, it does the following:

- reads `src` file
- launches puppeteer and awaits a new page load
- sets the page content from `src` file content
- sets page viewport for social image dimensions
- saves to `dist` a screenshot of the viewport
- closes puppeteer

This script is invoked via npm by adding it to the "scripts" section of your `package.json` file:

```json
{
  "scripts": {
    "og-images": "node functions/create-og-images.js"
  }
}
```

By this point you will be able to run `npm run og-images` and see the `_assets/og-images` folder fill with jpg's generated from the templates in `functions/_posts`. The image generation side of things is now complete.

On the 11ty side I then added a `ogImageFromSlug` filter (as shown below,) this looks up the image file to check it exists and if so returns the absolute url to where it should be. 

```js
// filters.js
const path = require('path');
const fs = require('fs');
const metadata = require('../_data/metadata.js');

module.exports = {
    ogImageFromSlug: (slug) => {
        const filename = `${slug}.jpg`;
        const filepath = path.join(process.cwd(), `_assets/og-image/${filename}`);

        return fs.existsSync(filepath)
          ? `${metadata.url}/img/og-image/${filename}`
          : null;
    },
};
```

This filter is used in my main template to conditionally add the og-image meta tag if an image is available:

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

Finally, because the images are output to the `_assets/og-image` folder, I need to tell 11ty to copy that to `img/og-image` when publishing:

```js
eleventyConfig.addPassthroughCopy({
  './_assets/og-image': './img/og-image',
});
```