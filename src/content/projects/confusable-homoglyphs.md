---
date: 2018-02-12
title: Confusable Homoglyphs
description: A PHP port of vhf/confusable_homoglyphs
git: https://github.com/photogabble/php-confusable-homoglyphs
packagist: https://packagist.org/packages/photogabble/php-confusable-homoglyphs
tags:
  - status/featured
  - language/Go
---

> Unicode homoglyphs can be a nuisance on the web. Your most popular client, AlaskaJazz, might be upset to be impersonated by a trickster who deliberately chose the username ΑlaskaJazz. (The A is the greek letter [capital alpha](http://www.amp-what.com/unicode/search/%CE%91))

This is a complete port of the Python library [vhf/confusable_homoglyphs](https://github.com/vhf/confusable_homoglyphs) to PHP. I found myself needing its functionality after reading [this article](https://www.b-list.org/weblog/2018/feb/11/usernames/) by James Bennett on validating usernames and how [django-registration](https://github.com/ubernostrum/django-registration/blob/1d7d0f01a24b916977016c1d66823a5e4a33f2a0/registration/validators.py) does so.

A huge thank you goes to the Python package creator [Victor Felder](https://github.com/vhf) and its contributors [Ryan Kilby](https://github.com/rpkilby) and [muusik](https://github.com/muusik); without their work this port would not exist.

This library is compatible with PHP versions 7.0 and above.
