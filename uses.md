---
layout: layouts/page.njk
title: "/uses"
sub_title: "Last updated June 21st, 2021."
folder: about
---

A somewhat complete list of tools, applications, hardware and services that I used on a day-to-day basis. Make sure to check out <a href="https://uses.tech">uses.tech</a> for a list of other peoples <code>/uses</code> pages!

## Hardware
* Lenovo x230 ThinkPad
  * **Processor**: Intel i7-3520m @ 2.90Ghz
  * **Memory**: 16GB 1600Mhz DDR3
* Apple 16" 2019 MacBook Pro
  * **Processor**: Intel Core i7 @ 2.6 GHz
  * **Memory**: 16GB 2667MHz DDR4
* ~~Apple 16" 2017 MacBook Pro~~
  * ~~**Processor**: Intel Core i7 @ 2.8 GHz~~
  * ~~**Memory**: 16GB 2133MHz LPDDR3~~
* ~~iPhone SE (32GB)~~
* iPhone 12 Mini (64GB)

## Software
* Chrome
* intelliJ PHPStorm and Goland

### Windows Specific
* Putty
* WinSCP
* HeidiSQL
* Vagrant &amp; VirtualBox

### OSX Specific
* Table Plus
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

For work, in addition to the above (excluding the hosting) I use:
* AWS
  * SQS
  * API Gateway
  * Lambda
  * S3

[^1]: I don't use Docker on the x230 ThinkPad due to it consuming too many resources
[^2]: I have a script in my `.zshrc` that creates an alias for each PHP version installed via brew
[^3]: I should really look into installing [Oh my Zsh](https://ohmyz.sh/)
[^4]: PHP is my primary language