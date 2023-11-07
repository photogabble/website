---
date: 2018-02-15
title: Clover Coverage Cli
description: Command line parser of clover.xml code coverage
git: https://github.com/photogabble/clover-coverage-cli
featured: true
language: PHP
---

I built this tool in PHP as a command line parser of clover.xml code coverage files. The idea was that it could be run as part of CI/CD against unit test coverage as a way of failing a deployment if a certain coverage threshold was not met.

At the time of writing the tool I thought it would be interesting to build a self-hosted reportage system that could consume the output of this tool and track a projects' coverage over time in the form of a pretty graph. I may eventually get round to building out [[Code Coverage Info]] but for now the cli tool is considered finished and the consumer api is not even started.

## Install
```bash
composer require photogabble/clover-coverage
```

## Usage

```
analyse [FILE] [OPTION]...
```
Options:

- `-f, --failure-percentage`
  Threshold below which files are marked as failed. Defaults to zero
- `-w, --warning-percentage`
  Threshold below which files are marked as warning. Defaults to 90
- `-e, --error-percentage`
  Threshold below which files are marked as error. Defaults to 80
- `-s, --summary` 
  Only show total coverage
- `--exit` 
  Exit with error code if overall coverage is equal to or less than failure percentage.

For example:

```bash
$: php .\bin\clover-coverage.php analyse clover.xml
 =================================================================================== ===========
  File                                                                                Coverage
 =================================================================================== ===========
  H:\clover-coverage-cli\src\Analyser.php                                             100.00% ✓
  H:\clover-coverage-cli\src\Analysis.php                                             100.00% ✓
  H:\clover-coverage-cli\src\CloverCoverageApplication.php                            100.00% ✓
  H:\clover-coverage-cli\src\Commands/Analyse.php                                     100.00% ✓
 =================================================================================== ===========
Code Coverage: 100.00%
```

## License

This tool is open-sourced software licensed under the [BSD 3-Clause License](https://github.com/photogabble/clover-coverage-cli/blob/master/LICENSE)