---
date: 2018-02-12
title: Laravel Registration Validator
description: Solid credential validation for Laravel >= 5.5
git: https://github.com/photogabble/laravel-registration-validator
packagist: https://packagist.org/packages/photogabble/laravel-registration-validator
tags:
  - status/featured
  - language/PHP
  - Laravel
---

> _An all-Latin username containing confusables is probably fine, and an all-Cyrillic username containing confusables is probably fine, but a username containing mostly Latin plus one Cyrillic code point which happens to be confusable with a Latin one… is not._ - [James Bennet](https://www.b-list.org/weblog/2018/feb/11/usernames/)

This package is a Laravel validation wrapper around the [PHP Confusable Homoglyphs library](https://github.com/photogabble/php-confusable-homoglyphs) to provide your application the ability to validate user input as not containing dangerous confusables.

I began writing this package soon after reading the above quote from [this article](https://www.b-list.org/weblog/2018/feb/11/usernames/) by James Bennett on registration credential validation that referenced how [Django’s auth system](https://github.com/ubernostrum/django-registration/blob/1d7d0f01a24b916977016c1d66823a5e4a33f2a0/registration/validators.py) validates new users credentials.

In addition to unicode confusables validation this package also includes a PHP port of the reserved name validation that Django's auth system uses.

This is a PHP7 project built for use with Laravel versions 5.5 and above.
