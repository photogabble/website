---
title: Why I built a tiny PHP Framework called Tuppence
draft: false
cover_image: /img/featured-images/building-tuppence-the-pico-php-framework.png
tags:
  - Programming
  - PHP
  - Framework
growthStage: evergreen
---

When you tell other developers that you have built your own framework, unless your someone like [Taylor Otwell](https://twitter.com/taylorotwell) most usually roll their eyes and question why you're not using an off the shelf framework like Laravel or Symfony before lecturing you on reinventing the wheel.

What they forget is that while those frameworks _are indeed_ incredibly useful, contain practically everything you could need to get started quickly and come with tens of thousands of hours of development and install counts in the millions. For certain projects, the kind that are little more than static websites having the whole of Laravel, Symfony or otherwise surrounding what could be done with a handful of files feels wasteful.

As an example think of a single page website that has one form with two radio inputs and a submit button. The backend consumes the POST request and increments one of two counters stored in a text file before returning a thank you page.

This could all be achieved with one `index.php` file containing all the html and php for displaying the page. It may seem a little dramatic to some, but there are a lot of projects that are nearly as basic as this example where a framework's boilerplate alone would outnumber the project code by a factor of ten let alone the vendor directory.

So what do you really need for a small project such as the api backend for an interactive display or iDetail anyway? A few years ago a thought I had found the answer in the micro PHP framework [Proton](https://github.com/alexbilbie/Proton). It provides routing via [League\Route](http://route.thephpleague.com/), dependency injection via [League\Container](http://container.thephpleague.com/) and events via [League\Event](https://github.com/thephpleague/event) and at its core is just one file containing less than 300 lines of code.

With [Tuppence](https://github.com/photogabble/tuppence) i'm not exactly reinventing the wheel; the last commit to Proton was by [Alex Bilbie](https://github.com/alexbilbie) on the 29th December 2015 and while you could say Proton is finished it is using out of date dependencies and that alone gave me the excuse to write Tuppence.

Tuppence uses the same components provided by _The League of Extraordinary Packages_ just the latest versions allowing it to boast being a [PSR-7](https://www.php-fig.org/psr/psr-7/) framework. Because my day to day involves a lot of working with Laravel projects I also created a [Tuppence Boilerplate](https://github.com/photogabble/tuppence-boilerplate) that allows me to get started quickly in a familiar "laravel-esq" directory structure with the addition of [PHP Plates](http://platesphp.com) for templating and database support provided by the [Doctrine ORM](https://www.doctrine-project.org/projects/orm.html).

As a basic starting block Tuppence has been used in a number of small projects which is exactly the niche it fits into. I didn't write it to replace frameworks like Laravel or Symfony but instead to be used on projects where their use would be overkill.