---
title: "Alphabetising Glossary Terms"
tags: [Blogging, HowTo]
growthStage: budding
---

In January, I added the [Glossary](/glossary/) content type to this #DigitalGarden as a way of storing short-form descriptions on colloquialisms that I use which may not be well known to the reader.

At the time of its creation I wanted to alphabetise the listing, but I didn't have enough content for it to look pleasing and the regular archive page template listing was [[Good Enough|good enough]].

Very recently I discovered [benji's tags page](https://www.benji.dog/tags/) which was exactly what I wanted my glossary page to look like; fortunately the source of Benji's website is open and available in the [GitHub repository benjifs/benji](https://github.com/benjifs/benji).

Alphabetisation is handled by an #11ty filter Benji called `alphabetSort`, their version only supports `Array<string>` while I wanted to be able to pass `Array<string|object>` so I made a few small changes:

```js
const alphabetSort = (collection) => {
    const alphabet = ['#', 'A', 'B', 'C', 'D',
      'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z', '?'];

    const sorted = alphabet.reduce((res, letter) => {
      res.set(letter, [])
      return res
    }, new Map());

    for (let item of collection) {
      const title = (typeof item === 'string')
        ? item
        : item?.data?.title;

      if (!title) continue;

      let key = (title[0] || '?').toUpperCase();
      key = alphabet.includes(key) ? key : (!isNaN(key) ? '#' : '?');
      sorted.get(key).push((typeof item === 'string') ? title : item);
    }

    return sorted;
}
```

This can then be used in your template to display a linked alphabet list header and list of items:

{% raw %}
```nunjucks
{% set alphabetSortedTerms = collections.collectionName | alphabetSort %}
<nav>
    <ul class="alphabet">
        {%- for letter, terms in alphabetSortedTerms %}
            <li><a {{ 'href=#' + letter if terms.length else '' }}>{{ letter }}</a></li>
        {%- endfor %}
    </ul>
</nav>

<section>
    {%- for letter, terms in alphabetSortedTerms -%}
        {% if terms.length > 0 %}
            <h4 id="{{ letter }}">{{ letter }}</h4>
            <ul>
                {%- for term in terms %}
                    <li><a href="{{ term.url }}">{{ term.data.title }}</a></li>
                {%- endfor %}
            </ul>
        {% endif %}
    {%- endfor %}
</section>
```
{% endraw %}

Now all I *need* to do is write some more glossary terms, and it will continue to look better over time.