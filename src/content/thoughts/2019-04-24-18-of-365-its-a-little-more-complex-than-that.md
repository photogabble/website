---
title: 18 of 365, It's a little more complicated than that
tags:
  - list/365-writing
  - 365DayProject
  - stage/seedling
canonical: >-
  https://wordsmith.social/carbontwelve/18-365-its-a-little-more-complicated-than-that
---


This is day eighteen of my attempt to write something, anything, every day for 365 days in a row.

—

This morning I was reminded the practical implications of an old adage _it's a little more complicated than that._ We had need for a basic function that takes a list of strings for example "Thing One, Thing Two, Thing Three" as an input and return a single string in the format of "Thing One, Thing Two and Thing Three."

The function itself is rather simple, weighing in at 15 lines of code in its non-golfed iteration, we thought that maybe it would be useful to be included in another public library. It was at this point things became complicated.

The function is tightly coupled to the English language and not all languages around the world concatenate a list of things in the same way. For us to even consider submitting a pull request against a library we would first need to make sure it was sound in the world of I18N.

In the end we settled for just keeping it in our project and moving on, there is a reason it's not already in the libraries we looked at; it's a little more complicated than we first thought.

—

🌻