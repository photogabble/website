---
date: 2017-10-17
title: Go Git Archive
description: A small command line tool for zipping all files changed between two git commits.
git: https://github.com/photogabble/go-git-archive
tags:
  - status/tinkering
  - language/Go
---

This was written as a learning exercise while I was learning to program in Go. It solves a problem that I faced at the time which was that we needed to upload just the files changed between commit versions as a zip to an FTP endpoint for deployment.

## Usage
By default `-last` will be the current `HEAD` within your repository and therefore only the `-first` value is required.

```
Usage of git-archive.exe:
  -first string
        The git commit that we are to begin at.
  -last string
        The git commit that we are to end at. (default "...")
  -list
        List files rather than write to zip.
  -v    Toggle verbose output.
```
