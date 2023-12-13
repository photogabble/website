---
date: 2020-07-13
title: TodoCI
description: 
git: https://github.com/photogabble/todo
status: wip
draft: true
language: Node
---

This project acts to provide a CI service that can scrape source files for `todo` items and provide a tracked list of items added/removed by the current commit as well as providing an overall list of todo items for the project as a whole.

This is made up of two projects: a web api for persisting project todo state and a command line tool for scraping a project's source code and reporting to the api.

The regex for this project comes from [todo-regex](https://github.com/regexhq/todo-regex).
