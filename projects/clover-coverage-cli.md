---
title: Clover Coverage Cli
description: Command line parser of clover.xml code coverage
git: https://github.com/photogabble/clover-coverage-cli
featured: true
language: PHP
---

I built this tool in PHP as a command line parser of clover.xml code coverage files. The idea was that it could be run as part of CI/CD against unit test coverage as a way of failing a deployment if a certain coverage threshold was not met.

At the time of writing the tool I thought it would be interesting to build a self-hosted reportage system that could consume the output of this tool and track a projects' coverage over time in the form of a pretty graph. I may eventually get round to building out [code coverage info](/projects/code-coverage-info/) but for now the cli tool is considered finished and the consumer api is not even started.