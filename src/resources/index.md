---
pagination:
  data: collections.resources
  size: 10
  alias: postsList
permalink: "resources/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---

{% extends "layouts/page.njk" %}

{% set title = 'Resources' %}
{% set titlePrefix = 'Index' %}

{% block pageContent %}

  <section>
    {% set displayResourceType = true %}
    {% include "components/post-list.njk" %}
  </section>

  {% if pagination.pages.length > 1 %}
    <nav>
      <p>
        Viewing page {{ pagination.pageNumber + 1 }} of {{ pagination.pages.length }},
        {% if pagination.href.previous %}<a href="{{ pagination.href.previous}}">Previous Page</a>{% endif %}
        {% if pagination.href.next %}<a href="{{ pagination.href.next }}">Next Page</a>{% endif %}
      </p>
    </nav>
  {% endif %}

{#  {% include '_includes/components/hot-topics.njk' %}#}
{% endblock %}
