---
title: "Refactored page git log section"
tags:
  - 11ty
growthStage: budding
---

In December last year with help from a PR raised by Belmin Began([@MaNemoj01](https://github.com/MaNemoj01)) I [[Addition of Git Log|added a git log]] to the content pages of this website, Belmin's contribution aside from being wrapped by caching has remained unchanged until today. I _like_ the addition of page history meta however, I do not want it to take over the page and in the case of some regularly updated pages that was beginning to happen.

I have therefore modified the history layout so that it is now hidden by default behind a small "page history" pull up tab on the page footer. I recently re-discovered the _magical_ `:target` css selector and used that for toggling the pull-ups display instead of relying upon JavaScript.

For the git history itself I changed the template so that it displays a short paragraph describing the input files creation with a link to edit it on GitHub. This means that the table of history now **only** displays if there is more than one commit for that page's input file.

This kind of page meta is likely only of use to me, but having shared my changes I had a positive response from a surprising number of people, and so I will be writing a short follow-up in the form of a tutorial on [[How to add a git log to your 11ty website]].
