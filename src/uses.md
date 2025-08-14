---
layout: layouts/page-post.njk
title: "/uses"
titlePrefix: "Me"
sub_title: "What's in my big bag of tools"
sidebar_component: uses
index_navigation: slash-pages
hide_header_date: true
folder: [about]
modified: 2025-08-14
---

::: abstract
A somewhat complete list of tools, applications, hardware and services that I used on a day-to-day basis. Make sure to check out <a href="https://uses.tech">uses.tech</a> for a list of other peoples <code>/uses</code> pages!
:::

## Hardware
* Main PC
  * **Processor**: AMD Ryzen 7 7700 @ 3.8-5.3GHz
  * **Memory**: 32GB Corsair Vengeance PC5-48000
  * **Motherboard**: ASUS ROG Strix AMD B650E-I mini-ITX
  * **Graphics**: NVIDIA GeForce RTX 970 4GB
  * **Case**: NZXT H1 v2
* [[Lenovo ThinkPad P15 Gen 1]]
  * **Processor**: Intel i7-10850H @ 2.70GHz
  * **Memory**: 64GB 2933MHz DDR4
  * **Graphics**: NVIDIA Quadro T1000 4GB
* [[Lenovo x230 ThinkPad]]
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

## Camera Hardware
- [Canon EOS 70D](https://www.canon.co.uk/for_home/product_finder/cameras/digital_slr/eos_70d/)
- Canon EF 40mm f2.8 STM Lens
- Canon EF 75-300mm f4-5.6 II Lens

## Software
* Chrome/Firefox/Safari
* [Obsidian.md](http://Obsidian.md) (see [[My publishing workflow]])
* intelliJ [PHPStorm](https://www.jetbrains.com/phpstorm/) and [Goland](https://www.jetbrains.com/go/)

### Windows Specific
* [Putty](https://www.chiark.greenend.org.uk/~sgtatham/putty/)
* [WinSCP](https://winscp.net/)
* [HeidiSQL](https://www.heidisql.com/)
* Vagrant & [VirtualBox](https://www.virtualbox.org/)

### OSX Specific
* [Table Plus](https://tableplus.com/), not as free as HeidiSQL but just as functional
* [DBngin](https://dbngin.com/)
* [Laravel Valet](https://laravel.com/docs/11.x/valet)
* [Docker](https://www.docker.com/)[^1]
* [Homebrew](https://brew.sh/), largely for installing PHP with [shivammathur/php](https://github.com/shivammathur/homebrew-php)[^2]
* [Z shell (zsh)](https://www.zsh.org/)[^3]

## Programming Languages (in order of preference)
* PHP[^4]
* Golang
* Node (TypeScript)

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
