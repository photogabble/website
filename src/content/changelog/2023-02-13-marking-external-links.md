---
title: "Marking external links"
tags:
  - Blogging
  - CSS
  - stage/budding
---

Up until [[Adding Wiki Links to 11ty]] the majority of links on this website where external. With increasing usage of Wiki Links however, it soon became obvious that I needed a way to differentiate between internal and external linking, thus [issue #174: Make external links easier to identify](https://github.com/photogabble/website/issues/174) was opened.

![Screenshot of a Wikipedia page showing its references, all external links have an icon next to them showing they are external in nature.](/img/marking-external-links-wikipedia.png "The external link icon seems to be as universal as the PDF icon")

Keeping with the theme of Wiki, I checked out how Wikipedia marks external links: 

{% raw %}
```css
a.external {
    background-image: url(images/link-external-small-ltr-progressive.svg);
    background-position: center right;
    background-repeat: no-repeat;
    background-size: 0.857em;
    padding-right: 1em;
}
```
{% endraw %}

The css is pretty basic, this is because Wikipedia attaches a `.external` class to all links it knows are external during the backend page render. I could write a [11ty transformer](https://www.11ty.dev/docs/config/#transforms) to do the same but that's not an insignificant amount of work and I know the [CSS attribute selector](https://www.w3.org/TR/selectors-3/#attribute-selectors) exists and is fairly well-supported[^1].

I rarely make use of CSS's attribute selector, after all - at heart I am a backend developer - so I had a quick search for a solution that I could lazily copy and paste[^2]. I quickly found [David Walsh's 2014 post showing how to style external links with CSS](https://davidwalsh.name/external-links-css) which I initially skim-read before heading to the comments and finding what I was looking for in Richard van Naamen's example:

{% raw %}
```css
a[href^="http://"]:not([href*="mydomain.com"]):before{ 
    content: " ";
    width: 16px;
    height: 16px;
    background: no-repeat url('images/link.gif'); 
    padding-right: 1.2em;
}
```
{% endraw %}

In hindsight (I'm writing this several days after this deployed,) combining David's selector example with the CSS body of Wikipedia would have completed the required functionality and closed the issue. However, that is not what I did.

Richard's solution worked, but I wanted to exclude hash links and any href that began with a forward slash (if *only* I hadn't skim-read Davids post!) The next link down was to a Stack Overflow question, wherein [Shaz's 2021 solution for styling all external links ](https://stackoverflow.com/a/5379820/1225977) gave me exactly what I was looking for: a copy-paste job!

{% raw %}
```css
a[href]:not(:where(
  /* exclude hash only links */
  [href^="#"],
  /* exclude relative but not double slash only links */
  [href^="/"]:not([href^="//"]),
  /* domains to exclude */
  [href*="//stackoverflow.com"],
  /* subdomains to exclude */
  [href*="//meta.stackoverflow.com"]
)):after {
  content: '↗️';
}
```
{% endraw %}

Ironically, had I fully read David's post I could have found this Stack Overflow answer quicker because David had actually linked to it. When his post was published it would have been to an older version of the answer which has since been updated but still, I would have obtained a solution faster.

[^1]: [Can I use: attribute selector](https://caniuse.com/?search=attribute%20selector) places it at being available to 99.89% of all users globally
[^2]: Writing this change log has actually taken me longer than writing the feature...
