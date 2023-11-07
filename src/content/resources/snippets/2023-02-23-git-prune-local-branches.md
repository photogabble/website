---
title: "Bash script for pruning stale local Git branches"
tags: [bash, git]
cite:
    name: Henry
    href: https://intellij-support.jetbrains.com/hc/en-us/community/posts/360006539480-How-can-I-refresh-already-deleted-Git-remote-branches-?page=1#community_comment_360002698740
---

I often forget to delete my local feature branches after they have been merged upstream and for a while used a plugin for the IntelliJ IDE's. However since that plugin is out of date I went looking for a bash script and found this snippet by someone called Henry:

```bash
#!/usr/bin/env bash

for branch in $(git branch -v | grep "gone" | awk '{print $1}')
do
    git branch -d $branch
done
```