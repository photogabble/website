---
title: Font Subsetting with Eleventy.js
tags: ["11ty", "Typography"]
growthStage: evergreen
draft: true
---

For a while now PhotoGabble has used the default `monospace` system font for all typography; this was initially a stop-gap measure in order to quickly ship the blog and ever since I have wanted to update with a more bespoke font choice that enhances readability[^1].

The problem with font choice is that it's huge and a lot of the font's that I ended up liking cost a lot of money[^2]. Early on I decided that I would only use free type faces and ideally focus on those that where open source. After a great deal of searching I ended up with a list containing just two fonts:

- [Atkinson Hyperlegible Font](https://brailleinstitute.org/freefont) by the Braille Institute
- [Iosevka](https://typeof.net/Iosevka/) by [Belleve Invis](https://typeof.net/)

Given my preference for monospace I settled for using Iosevka; it provides two quasi-proportional families: _Iosevka Aile_ and _Iosevka Etoile_ which have been made for documents and feel more readable to my eyes than the default `monospace` I had been using *while* retaining the distinctive feel that I like in monospaced fonts.

{% figure "/img/font-subsetting-with-eleventyjs-1.png" "**Fig 1.** Using [wakamaifondue](https://wakamaifondue.com/) we can see a lot of supported glyphs that I'm not going to be using..." "TrueType font with 5278 characters, it has 162 layout features." %}

I finally settled upon using the quasi-proportional slab-serif Etoile, however out of the box the woff2 file is 1.3MB in size and as you can see in *fig 1* above this is because it contains an impressive number of glyphs, support for languages and layout features - a lot of which will go unused on this website.

## Building Iosevka from Source
In an attempt to solve the filesize issue I decided to build Iosevka from source using the [Iosevka Customizer](https://typeof.net/Iosevka/customizer). Building from source isn't too difficult, it requires you have at least node v14 installed and [ttfautohint](https://freetype.org/ttfautohint/). I used homebrew to install ttfautohint with the following brew command:

```
$ brew install ttfautohint
```

Then it was a case of following the [instructions for building Iosevka from source](https://github.com/be5invis/Iosevka/blob/main/doc/custom-build.md) using the following toml file the Customizer produced:

```toml
[buildPlans.iosevka-custom] 
family = "Iosevka Custom" 
spacing = "quasi-proportional" 
serifs = "slab" 
no-cv-ss = true 
export-glyph-names = false 

[buildPlans.iosevka-custom.weights.regular] 
shape = 400 
menu = 400 
css = 400 

[buildPlans.iosevka-custom.slopes.upright] 
angle = 0 
shape = "upright" 
menu = "upright" 
css = "normal"
```

After a couple of minutes of processing the result was a woff2 file weighing 349KB. A 71.73% decrease in filesize is impressive but 349KB is still to heavy for my liking and checking the built font using [wakamaifondue](https://wakamaifondue.com/)  shows it contains a lot of Glyphs that _again_ I don't necessarily need.

{% figure "/img/font-subsetting-with-eleventyjs-2.png" "**Fig 2.** A large reduction in size but still too heavy for my liking" "TrueType font with 5278 characters, it has 32 layout features." %}

Above I have only built the regular typeface however for this website I will need four typefaces: regular, italic, bold and bold-italic. If serving one 249KB font file doesn't go against my mantra of [[Minimalism|minimalism]] serving four of them certainly does. I needed to find a way of reducing the filesize further. Enter stage right, subsetting!

## Content-Based Subsetting

For the unaware, subsetting is the practice of creating a "subset" of a font that contains a custom collection of glyphs. Due to their limited nature the resulting font file will be vastly smaller than the source its based upon.

Because this website is statically generated with zero dynamic content I can create a super-targeted subset that only contains the characters known to be used. This process is very similar to [PurgeCSS](https://purgecss.com/) and similarly needs to be done each time the content changes, something that can be automated at build time and restricted to only happen during a production build so as not to slow down development build times.

To familiarise myself with subsetting I read Paul Herbert's 2022 post on [Font Subsetting Strategies](https://cloudfour.com/thinks/font-subsetting-strategies-content-based-vs-alphabetical/); Paul makes use of [Glyphhanger](https://github.com/zachleat/glyphhanger) to scan for unique glyph usage and produce the subset font. There is also available the [subfont](https://www.npmjs.com/package/subfont) tool which appears to do the same.

Both have a dependency upon [Pythons fonttools library](https://github.com/fonttools/fonttools) in their usage of `pyftsubset` and therefore add Python as a dependency into your build pipeline; the [Netlify build environment supports Python](https://docs.netlify.com/configure-builds/manage-dependencies/#python) so hopefully this shouldn't be a problem, although at time of writing I haven't tested subsetting in the build pipeline.

