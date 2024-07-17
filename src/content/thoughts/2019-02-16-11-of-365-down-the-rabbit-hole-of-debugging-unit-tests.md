---
title: 11 of 365, Down the rabbit hole of debugging unit tests
tags:
  - list/365-writing
  - 365DayProject
  - stage/seedling
canonical: >-
  https://wordsmith.social/carbontwelve/11-365-down-the-rabbit-hole-of-debugging-unit-tests
---


This is day eleven of my attempt to write something, anything, every day for 365 days in a row.

—

Yesterday I came across this weird error while running one of the unit tests I was working on:

```
PDOException: SQLSTATE[42000]: Syntax error or access violation: 1305 SAVEPOINT trans2 does not exist
```

It may not look like much but in search of a resolution I ended up taking a deep dive into a [[rabbit hole]] of red-herrings and incorrect assumptions.

Having spent a good few hours thinking it was something in my code that was breaking and finding nothing at fault I quickly realised that the tests that were returning the error all had something in common. I was running them individually, if I ran the tests in a batch or all of them then the error didn't show.

It was at that point that I began kicking myself, the problem wasn't caused by anything I had written but instead by my IDE of choice: PHPStorm.

Looking at the console output from running the tests as a batch or all of them I could see that PHPStorm was generating the command correctly with `--configuration` set. However, if I ran an individual file or method it would generate the PHPUnit command with `--no-configuration`. It was the latter that caused the tests to break.

My issue was caused due to my not setting a default configuration file to be used by the test runner, once set PHPStorm began generating the correct command and my tests began working as expected.

Six hours wasted, all because I didn't know to set an obscure configuration property in a config sub-pane popup of a config sub-pane popup.

—

Welcome to programming.

🌻