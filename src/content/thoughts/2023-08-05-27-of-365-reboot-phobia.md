---
title: 27 of 365, Reboot-phobia
tags:
  - series/365-writing
  - 365DayProject
  - stage/seedling
---


This is day twenty-seven of my attempt to write something, anything, every day for 365 days in a row; currently 7.40% complete with a five day streak.

—

Earlier this week Scaleway shutdown and moved the VM I have hosted with them as part of mandatory server maintenance on the hypervisor it was hosted on. I'm assuming after so long, the physical server itself is likely being swapped out and normally such events are rare.

This did however prompt me to log into the server before the move and check its `uptime`:

```
$ uptime
07:34:48 up 884 days, 18:47, 1 user, load average: 0.08, 0.03, 0.01
```

884 days, almost two and a half years consistently operational; how's that for reliability? I have generally had no complaints about Scaleway, although I had heard plenty from others over their original ARM offering (its reliability ultimately seemed to be its own demise.)

—

What this event reminded me of is that I have a fear of rebooting remote servers, lets call it *reboot-phobia*. My worry has always been that the server, for whatever reason, will not come back up, or would come back up in a way that I couldn't access it. I don't experience the same dread over `shutdown -r now` when operating a machine I have physical access to, and it seems that the more frequently I reboot a remote server, the fewer qualms I have over the whole process.

This has lead me to operate a fleet of servers all of which have uptime figures around 1.5 - 3 years; I tend to keep on top of package updates and if one absolutely requires a reboot I will often weigh the effort of spinning up a replacement machine over the risk of rebooting.

Probably not ideal and in the world of virtual machines, automated deployment pipelines and *the cloud*, probably not required. I do however, prefer to maintain physical servers and automate deployment via dokku.

—

Yesterday while setting up a fresh server with Hetzner my fears where realised after updating the newly minted server it asked me to reboot to apply changes to a service and refused to come back online until I issued a power cycle.

This is something I will be writing about in detail at a later date but the gist of it is the Hetzner dedicated boxes don't yet (unbeknownst to me at the time) officially support Debian 12 on their dedicated hardware and so there are unresolved bugs I stumbled into.

I don't have the kind of budget required for running a high availability set so for now reboot-phobia prevails.

🌻
