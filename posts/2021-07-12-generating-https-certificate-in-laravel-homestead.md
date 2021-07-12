---
title: Generating HTTPS certificates in Laravel Homestead
draft: true
categories:
    - programming
    - tutorials
---

In my day job I use Laravel Homestead as my local development environment, however I haven't been using it how it was designed and instead have kept the same Homestead install open for just over a year now running on a painfully out of date (8.2.1) version of Homestead.

In the past week I finally hit the milestone of the Homestead box being alive for a year celebrated by the HTTPS certificates it had generated for my projects expiring. I am unsure if updating the box or re-provisioning it will stop things from working and at the time the certificates had expired I didn't have time to risk on that endevour.

Additonally I don't normally go about generating certificates myself and in the eventuality that I do have to create a self signed certificate I normally go to the internet to find a tutorial. In this case that search came up empty, or rather, it was full of people saying Homestead installs should be brought down, little more than knuckle dragging comments akin to "duh, you're using it wrong, why you doing that?"

Therefore I lept down the rabbit hole and decided to see how Homestead generates the certificates during provisioning and to see if there was some lines of shell script I could just copy and paste.

As it so happens, there is. Inside the homestead [scripts directory](https://github.com/laravel/homestead/tree/main/scripts) there is `create-certificate.sh`. You can copy the content of that script into your Homestead VM make it exectuable with `chmod +x create-certificate.sh` and then run it using your development domain as its argument: `./create-certificate.sh my-project.local`.
