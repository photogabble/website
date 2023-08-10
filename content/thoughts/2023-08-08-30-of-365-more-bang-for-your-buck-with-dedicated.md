---
title: 30 of 365, More bang for your buck with dedicated hosting
tags: 
  - list/365-writing
  - 365DayProject
growthStage: seedling
---

This is day thirty of my attempt to write something, anything, every day for 365 days in a row; currently 8.22% complete with an eight day streak.

—

I seek simplicity in most things and following the path of least resistance lead me to host my projects on dedicated servers (currently with [Hetzner](https://www.hetzner.com/) in Finland.) My experience in doing so has been that I get more bang for my buck.

For example I have had for the past two years a AX51-NVMe server hosted with Hetzner that provides 8C/16T, 64GB RAM, 1TB NVMe storage *and* unrestricted traffic through a single 1 Gbit/s port for just €57.60 a month! I actually found that to be more than I needed and was in the process of migrating to [AX41-NVME](https://www.hetzner.com/dedicated-rootserver/ax41-nvme) server which provides 6C/12T, 64GB RAM, 512GB NVMe storage and unrestricted traffic through a single 1 Gbit/s port for just €35.60 a month before I had reboot issues with Debian 12 on their hardware and decided to look elsewhere.

Both prices are excluding VAT which in my country adds 20%; however the cost of both servers running concurrently plus two IPv4 addresses including tax is still *just* €115.92/mo.

These are of course Hetzner's AX range of servers which as far I am aware, use off the shelf consumer AMD processors however, I have not had any reliability issues and my server has been operational for a year and a half without fault; your mileage may vary.

—

The aforementioned issues with rebooting Debian 12 on Hetzner's dedicated hardware lead me to look at alternatives; I have previously used Scaleway and their "new"[^1] [Elastic Metal](https://www.scaleway.com/en/elastic-metal/) dedicated servers appear to be on par with the offerings at Hetzner with [Scaleways EM-A410X-SSD offering](https://www.scaleway.com/en/elastic-metal/aluminium/) being equivalent to the AX41-NVMe I had procured from Hetzner for a similar price.

—

There are benefits to cloud computing, high availability, automated scaling, zero downtime (when done *right*) and a whole rolodex of interconnectable services that can act as jigsaw pieces for building cloud based applications. However, in the majority of cases I have personally seen: companies that move into the cloud do so by spinning up a handful of EC2 containers and maybe migrate their database's to RDS then call it a day.

From a finance point of view this doesn't make sense. AWS's `m6g.4xlarge` seems to be the closest I could find to Hetzner's AX51-NVMe offering in that it comes with 16vCPUs and 64GB RAM for $282.07/mo if reserved for a year, even if reserved for three years, at $195.49/mo it is still more expensive than Hetzner and that's not including bandwidth or storage which are changed extra at AWS.

On the flip-side at a previous employer; we ran online events with a hundred or more attendees. This meant that our servers would be hit by thousands of concurrent requests a second for a few minutes regularly throughout the event when delegates where moved from one phase to another. Our solution at the time was to spin up an EC2 instance **per** event that had a big enough core count to process the influx of requests in a reasonable time.

Ideally that application would have been refactored to be entirely cloud based, leveraging the scalability and power of API Gateway, lambda, SQS and a plethora of other products in order to be elastic to the varying needs of the events being hosted, unfortunately time was always against us[^2] so going with EC2 was the only viable solution at the time.

There *are* obvious benefits in going with cloud offerings and this post isn't about disparaging the cloud but when it comes to compute you really do seem to get more bang for your buck with dedicated hardware.

🌻

[^1]: New to me since I last logged into their dashboard
[^2]: This was during the pandemic induced lockdown, we where a physicals events company that had to pivot to be 100% online in as short a time as possible; it took a lot of blood, sweat and tears but we did it