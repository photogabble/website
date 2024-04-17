---
layout: layouts/page.njk
title: "/uses"
titlePrefix: "Me"
subTitle: "Last updated June 21st, 2021."
folder: about
---

A somewhat complete list of tools, applications, hardware and services that I used on a day-to-day basis. Make sure to check out <a href="https://uses.tech">uses.tech</a> for a list of other peoples <code>/uses</code> pages!

## Hardware
* Main PC
  * **Processor**: AMD Ryzen 7 7700 @ 3.8-5.3GHz
  * **Memory**: 32GB Corsair Vengeance PC5-48000
  * **Motherboard**: ASUS ROG Strix AMD B650E-I mini-ITX
  * **Case**: NZXT H1 v2
* Lenovo x230 ThinkPad
  * **Processor**: Intel i7-3520M @ 2.90Ghz
  * **Memory**: 16GB 1600Mhz DDR3
* Apple 16" 2019 MacBook Pro
  * **Processor**: Intel Core i7-9750H @ 2.6 GHz
  * **Memory**: 16GB 2667MHz DDR4
* ~~Apple 16" 2017 MacBook Pro~~
  * ~~**Processor**: Intel Core i7-7820HQ @ 2.8 GHz~~
  * ~~**Memory**: 16GB 2133MHz LPDDR3~~
* ~~iPhone SE (32GB)~~
* iPhone 12 Mini (64GB)

## Software
* Chrome/Firefox/Safari
* Obsidian.md (see [[My publishing workflow]])
* intelliJ PHPStorm and Goland

### Windows Specific
* Putty
* WinSCP
* HeidiSQL
* Vagrant & VirtualBox

### OSX Specific
* Table Plus
* DBngin
* [Laravel Valet](https://laravel.com/docs/10.x/valet)
* Docker[^1]
* Homebrew
  * [shivammathur/php tap for PHP 5.6 to 8.3](https://github.com/shivammathur/homebrew-php)[^2]
* Z shell (zsh)[^3]

## Languages
* PHP[^4]
* Node (TypeScript)
* Golang

## Stacks
For personal projects and self-hosting I use:
* Dedicated Hosting by Hetzner
  * Nginx
  * Dokku
  * MySQL
  * Postgres
  * Redis
* Netlify

For work, in addition to the above (excluding the hosting providers) I use:
* AWS
  * SQS
  * RDS
  * Elastic Beanstalk
  * API Gateway
  * Lambda
  * S3

[^1]: I don't use Docker on the x230 ThinkPad due to it consuming too many resources
[^2]: I have a script in my `.zshrc` that creates an alias for each PHP version installed via brew
[^3]: I should really look into installing [Oh my Zsh](https://ohmyz.sh/)
[^4]: PHP is my primary language
