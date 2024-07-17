---
title: 22 of 365, Grievances with WriteFreely
tags:
  - list/365-writing
  - 365DayProject
  - stage/seedling
canonical: https
---


This is day twenty-two of my attempt to write something, anything, every day for 365 days in a row; not that I have been very consistent.

—

As you may or may not be aware [Wordsmith Social](https://wordsmith.social) is powered on the backend by the Open Source Software [WriteFreely](https://writefreely.org/).

> WriteFreely is built around writing. There's no news feed, notifications, or unnecessary likes or claps to take you away from your train of thought.

The design ethos of WriteFreely is what initially sold me on using it for powering Wordsmith; having an almost entirely minimalist design for both the content editor and the published display spoke to what I had been yearning for in order to start my 365-day writing challenge.

With the majority of distractions removed from the platform, the focus can be entirely about content. This made Wordsmith my go-to place for storing notes-to-self and short story ideas as it is largely distraction free.

—

Wordsmith has been in operation for little under a year, since first going live in January 2019 it has, as of writing this, become home to 1,021 articles across 424 blogs. While not exactly groundbreaking numbers that does put us in [fourth place](https://fediverse.network/writefreely?count=statuses) when placed against all other known WriteFreely instances.

Within the first month of writing on Wordsmith and using the WriteFreely software on a daily basis I had already put together a growing list of issues I had with either the interface, its experience or its interaction with the wider fediverse. At the time I recognised that the software was only in a pre-version-one phase and kept my complaints within a draft document in the hope that the majority would be quickly dealt with as they were in my mind quite simple to fix.

Twelve months later and while there _has_ been considerable progress made, in honesty the difference between version [0.7](https://github.com/writeas/writefreely/releases/tag/v0.7.0) from January to [0.11](https://github.com/writeas/writefreely/releases/tag/v0.11.1) now isn't very noticeable and that's with 358 commits to the code authored by a growing range of developers.

--

The seed for my digging out my year-old grievances is reading the final WriteFreely post by [digitalgyoza](https://digitalgyoza.writeas.com/). There they bode a fond farewell to the software in preference for using WordPress with their list of key deal-breakers containing a number of items I had previous personal issue with.

> _"Using the Write.as platform has been a lot of fun, and the distraction-free approach is something I love. However right now, I feel there are some key features which just aren't quite there yet. Features that are pretty native and built-in on other platforms."_
> – **digitalgyoza**


Before I begin with my list of grievances, to be fair to _WriteFreely_ it hasn't yet had a `1.0` release and some of the below _is_ included in the projects [roadmap](https://phabricator.write.as/tag/writefreely/). However, given that [write.as](https://write.as/), the platform _WriteFreely_ originates from, has been in production for four years it is astonishing that some of these features are missing.

## Password Resets

Given that password resetting is one of those features that all competitor products have, and is often one of the first things developers add to a new project. It is astonishing that a year after I first noted it being missing it is still not something that _has_ been implemented!

Writing the functionality has been on the roadmap [(T508)](https://phabricator.write.as/T508) since the beginning of 2018 and attached to the version 1.0 track since the beginning of 2019.

> _"How do we send email with a reset link if they haven't set an email or if the email they provided doesn't exist in the system?"_
> – **joyeusenoelle**

Providing password resets for WriteFreely users is complicated a little bit by the fact that setting an email address on signup is _optional_. This means that for those users the traditional password reset route will not work. In my honest opinion that is to be expected behaviour, we can't send you a password reset if you don't provide means in which to do so.

For those users the software could resort to the "paper keys" approach whereby all users are provided a list of one time use keys that can be used for authenticating when they forget their password.

## Custom Avatars

At current _WriteFreely_ has pre-designated avatars for [0-9 and a-z](https://github.com/writeas/writefreely/tree/master/static/img/avatars) but no way for the end user to define one per Collection/Blog.

Aside from this potentially being problematic for users of non latin alphabets this is again along with _password resets_ a core feature that traditionally gets added to a project first. I wouldn't mind if instead of allowing arbitrary user upload, _WriteFreely_ allowed the linking of a [Gravatar](https://en.gravatar.com/) account or similar third party avatar provider.

A job ([T546](https://phabricator.write.as/T546)) was created for this issue in December 2018 but was recently added to the _"Far Future"_ track, so I have little hope of it being implemented any time soon.

## General Image Uploads

This is a sideline to my previous complaint and also has its own job ([T550](https://phabricator.write.as/T550)) that was drafted around the same time as T546. If we are allowing users to upload custom avatars that becomes the prerequisite to adding general image uploading.

The downside to this is that instance admins would likely want to limit how many items each user can upload or the total disk space consumed and either of those tasks take time to engineer. However, given that competing software often contains this feature it's something that is increasingly becoming a obvious missing feature.

## User & Content Moderation

User moderation is a huge deal, admins and instance moderators need to have tools made available to them so that abusive users can be identified and dealt with as efficiently as possible.

What is shocking to me is that this is something that had been left out of _WriteFreely_ until very recently with the addition of admin user tasks such as silencing ([T661](https://phabricator.write.as/T661)), suspending([T553](https://phabricator.write.as/T553)), and removing items from the public feed ([T578](https://phabricator.write.as/T578)). The latter of those being raised by myself back in May 2019 after a short bout of SPAM being posted on Wordsmith Social.

## Automatic SPAM Detection

_WordPress_ has had automatic SPAM detection provided through [Akismet](https://akismet.com/) for many, many, many years. It makes sense, given the potential for abuse, that _WriteFreely_ support integration with SPAM detection services like Askimet, doing so would greatly reduce the burden of moderation from seek-and-destroy to check this flag list and delete/allow each item after a quick review.

Unlike my previous grievances this still has no issue in the projects tracker associated with it; I will be querying that after this article is written.

## Require Email on Signup

For various philosophical reasons _WriteFreely_ doesn't require an email address upon new account registration. Aside from the obvious issues with password resets that I have already tended this also makes it difficult for platform admins to inform users of events happening on their account such as moderation decisions.

I feel that this should be a configurable option that instance admins can toggle to enable/disable email address requirement upon sign-up.

## Content Reporting

Mastodon has its own [account reporting api](https://docs.joinmastodon.org/api/rest/reports/) that allow users on other instances to flag to an instance admin accounts that are spamming, being abusive or in breach of their instance ToC or CoC. Traditional publishing platforms like [twitter](https://help.twitter.com/en/rules-and-policies/twitter-report-violation) and [WordPress.com](https://en.support.wordpress.com/report-blogs/) have their own process through which the public can report content for various reasons, so it stands to reason that _WriteFreely_ should too.

Anyone should be able to report content published on a _WriteFreely_ platform as one of the following categories:

* This content is SPAM
* This content is abusive
* This content promotes self-harm/suicide
* This content infringes upon my copyright

With the report flagging that content to the instance admin/moderation for dealing with. At the very least there should be a "report" link in the footer of every page that takes the user to a page detailing how they can get in touch and report an issue.

## Per Collection/Blog "metadata"

I believe this to be a feature largely anchored to Mastodon with its `fields_attributes ` attribute containing up to four items of user editable profile metadata per user. However, given that Mastodon is the largest fediverse subscriber it makes sense that this functionality should be added to _WriteFreely_

## Federation Interactions (follows/comments/favourites)

While the statistic is hidden away, as a blog author you can see how many Fediverse followers your publication has. However, there is no facility within _WriteFreely_ to view comments or number of favourites as all let alone on a per-post basis.

I can understand some of the philosophical reasoning behind this however I personally feel this should be something core to the platform and able to be disabled on a per-user basis if such things cause anxiety.

Ideally I would like to see comments appear on each posts page with instructions to users for how they can add their own via federated interaction; maybe even going so far as to implement Mastodons remote follow/boost/like functionality.

—

I am an advocate of federated software and in having used _WriteFreely_ for the past twelve months I am also quite fond of it even with its enormous feature gaps.

That being said, Wordsmith Social is growing and will only continue to get bigger and more active and therefore some if not all of my above grievances are quickly becoming important hot issues that need solving sooner rather than later.

—

To that end, it may be that I have to roll up my sleeves and dig into the code in order to ensure that some if not all of the above eventually makes it into production even if that necessitates Wordsmith Social becoming a fork of _WriteFreely_.

🌻