---
title: Creating a now page archive with 11ty
tags:
  - JavaScript
  - 11ty
growthStage: budding
---

I first added a `/now` page[^1] to PhotoGabble in March 2021, and in the tradition that is blogging I promptly forgot about it and failed to update its content until today. In an attempt at keeping this section of my website updated I have set a monthly timer to at least prompt me to give it a fresh look twelve times a year.

With more regular updates I would like to keep a history of what I have been focused on (or at least what I say I am focusing on) and so I used [11ty's collections](https://www.11ty.dev/docs/collections/) functionality:

```javascript
const nowUpdates = (collection) => {
    return [...collection.getFilteredByGlob('./now/*.md').filter((post) => !post.data.draft)];
}
```

Within the `/now` folder I placed `now.json`:

```json
{
  "draft": false,
  "layout": "layouts/now.njk"
}
```

I then converted the previous now page html into a `2021-03-19.md` file and created a new `2021-05-17.md` file for today.

In order to make sure that the most recent now page content is displayed at `/now` I used the following nunjucks template for `/now.njk`:

```twig
{% raw %}{% extends "_includes/layouts/now.njk" %}

{% set title = '/now' %}
{% set page = collections.nowUpdates | reverse | first %}
{% set content = page.templateContent %}{% endraw %}
```

This sets the `page` variable to equal the most recent now page content from the `nowUpdates` collection and then sets the `content` variable to be that pages `templateContent`. My layout can then function as it would normally for both the `/now.njk` page and any of the archive pages.

To the visitor there are no noticeable changes, this is because while 11ty is now generating pages for the now archive, they aren't linked from anywhere.

I added a history list navigation to my now page template using the following nunjucks code:

```twig
{% raw %}<nav>
    <h3>Update History</h3>
    <ul>
        {% set current = collections.nowUpdates | reverse | first %}
        {% for update in collections.nowUpdates | reverse %}
            {% if update.fileSlug == current.fileSlug %}
                <li><a href="/now" title="Go to current now page">Current</a></li>
            {% else %}
                {% set updateTitle = update.date | dateToFormat("dd LLL yyyy") %}
                <li><a href="{{ update.url }}" title="Read {{ updateTitle }}">{{ updateTitle }}</a></li>
            {% endif %}
        {% endfor %}
    </ul>
</nav>{% endraw %}
```

If you have been following along, you should now have your most recent now update visible via `/now` with you history of
updates navigable via `/now/{YYYY-MM-DD}`. There is a minor snag with this method, Eleventy will generate a history page for the current now entry. This means your current now entry will exist at two navigable pages, however so long as you remember not to link to the current one as seen in the above code example then it can be ignored.

The [source code for this website](https://github.com/photogabble/website) is open source, feel free to browse and ask questions if you would like to know more about how I have achieved functionality you would like to replicate in your own projects. 

[^1]: [What is a now page?](https://nownownow.com/about)
