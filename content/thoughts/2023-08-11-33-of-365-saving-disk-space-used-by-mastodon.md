---
title: 33 of 365, Saving disk-space used by Mastodon
tags: 
  - list/365-writing
  - 365DayProject
  - Mastodon
growthStage: seedling
---

This is day thirty-three of my attempt to write something, anything, every day for 365 days in a row; currently 9.04% complete with an eleven-day streak.

—

Over the past few weeks I have been in the process of setting up a fresh dedicated box on to which I will eventually migrate the [[notacult.social]] Mastodon instance that I currently administer and sponsor with hosting.

Part of this process has been taking stock of what needs to be moved over; during which I discovered that Mastodon alone was consuming 163GB of disk, 162GB of which was the `system/cache` folder. In order to reduce that for the purpose of speeding up transfer I went looking for other people's experience and found Ricard Torres's post from last year on [Improving Mastodon’s disk usage](https://ricard.dev/improving-mastodons-disk-usage/).

Ricard shares the `purge-media.sh` script they run every three hours on their Mastodon server, but he doesn't go into detail what each of the `tootctl` commands do. I thought I should do so here.

—

First Ricard prunes both remote accounts that never interacted with a local user and remote statuses that local users never interacted with. For the former I couldn't actually find the command in the [Mastodon documentation on its accounts tool](https://docs.joinmastodon.org/admin/tootctl/#accounts) it does however exist as per the [source code of accounts.rb](https://github.com/mastodon/mastodon/blob/main/lib/mastodon/cli/accounts.rb#L556), you can run it with `tootctl accounts prune`.

I'm unsure if associated media is removed at time of pruning of if this is the cause of orphaned media that the `media remove-orphans` command is intended to clean. In my case this pruned 16,693 out of a total 18,139 accounts that the server knew about.

Having run this, I'm not sure the space savings are worth the effort. It doesn't seem to reduce the amount of storage used by Mastodon by any huge amount. Subsequently, I haven't run the `tootctl statuses remove` command and slightly regret removing accounts. This is because even if you haven't interacted with an account, it's a pain if you go to someone's home feed on your server and see a blank feed with the suggestion of going to their profile page on their server to see their posts.

—

The two commands that I have used on a semiregular bases are removing preview cards and media; I expect these to give the largest gains in recovered disk space.

Ricard's script purges preview cards older than 4 days. I have chosen to instead remove link previews older than 30 days. I have chosen to keep this above 14 as per the [Mastodon documentation on the preview_cards tool](https://docs.joinmastodon.org/admin/tootctl/#preview_cards) because Mastodon doesn't re-fetch previews unless the link in question has been reposted 14 days after the first fetch.

I didn't know this the first time round with setting the `--days` value to 4 and removed 473,504 previews at a saving of approx 15 GB of space which to be honest, isn't a lot. By default, Mastodon will keep preview cards for 180 days.

```
$ tootctl preview_cards remove --days 30
```

Preview cards are small and numerous, I tend to find that post media is the largest category of storage in use; by default as per the [Mastodon documentation on media remove tool](https://docs.joinmastodon.org/admin/tootctl/#media-remove) this defaults to removing anything older than 7 days.

```
$ tootctl media remove
```

By now it was time to use the `du` command and I could see that the Mastodon `system/cache` was now consuming 139GB, so the aforementioned had recovered 23GB but that honestly isn't a lot with 1TB of storage to expand into. From running `du -h | sort -rh | head -10` within the mastodon storage folder I can see that `system/cache/accounts` is consuming 94GB with the bulk of that: 61GB, being `headers`.

The `media remove` command has two sub-commands added in 4.1.0: `--remove-headers` and `--prune-profiles`. They essentially do exactly what it says on the tin, instead of media attachments `--remove-headers` prunes all locally cached copies of headers from other servers while `--prune-profiles` does the same but includes cached avatars as well.

I chose to go with `--remove-headers` as with Ricard's script, however here I am using the default 7 days and excluding accounts that are followed by members of my server.

```
$ tootctl media remove --remove-headers
```

In my case this removed 329,580 files, recovering approx 49.3GB of disk space! I was interested in how much more pruning profiles would recover and so initially ran both command with the `--dry-run` flag set; pruning headers and avatars would recover ~70GB of space, so a 30GB increase on just removing headers.

Finally, we task Mastodon with removing orphaned media; as per the [Mastodon documentation on remove orphaned media tool](https://docs.joinmastodon.org/admin/tootctl/#media-remove-orphans) this scans for files that do not belong to existing media attachments, and removes them. This one takes a while because it scans each file to check if it's referenced from the database, if you're using an S3 provider keep in mind that this will hammer your API quota with all the file reads.

```
$ tootctl media remove-orphans
```

In my case this took around 8 minutes to scan 784,102 media files, eventually removing 222 orphans at a saving of 17.5MB. I'm unsure if it's actually running this on a regular basis, I certainly wouldn't if you are using S3 based storage!

—

After all this pruning I'm left with Mastodon consuming 86GB, down from the 162GB that I started with at an impressive 76GB recovered. Nice.

🌻