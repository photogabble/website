---
title: Installing Turbo C on DOSBOX
tags: [Revived, DOS, Turbo C]
featured: false
cover_image: /img/featured-images/installing-turbo-c-on-dosbox.png
growthStage: evergreen
---

> Hi there, this article was first published in 2009 and the information within was accurate at that time. I revived it in 2018 at the request of Twitter user [FlowingLily](https://twitter.com/FlowingLily) so why not go give them a thanks for prompting the republishing :) I even managed to dig out the original [TURBOCAPP.zip](/files/TURBOCAPP.zip) from my deep archive backup.

Inspired by [this thread](http://www.dosgames.com/forum/viewtopic.php?t=10322) at dosgames forums by the user [redshock](http://www.dosgames.com/forum/search.php?search_author=redshock) I have written my own guide to installing Turbo C under Dosbox and beginning to program with it. I have also produced a nice osx app which contains Turbo C and Dosbox within it so you can skip the setup and install steps and get right on with your programming. 

To follow this tutorial you need both [dosbox](http://www.dosbox.com/) and a copy of the Turbo C installer which I have mirrored [here](/files/tc201.zip).[^1]

Once you have downloaded turbo C and unpacked the zip archive it came in you will be presented with three directories called Disk 1,2 and 3. For ease of installation you need to copy the files from these three directories into one directory which I shall call `turboc`. 

Once you have done this. If you are a Windows user put this directory so it is `C:\turboc` or for mac users put it on your desktop so its location is `/Users/<username>/Desktop/turboc`. Once this is done and you have Dosbox installed create another directory called `C:\dos` if your a Windows user or `/Users/<username>/dos` for those running OSX. This will be the directory on your machine that you will install `turboc` into and once it is done you will be able to delete the `C:\turboc` directory.

To install Turbo C you need Dosbox version 0.71 or above, once you have installed it and started the application running mount `C:turboc` as `a:` and `C:dos` as `c:` via the following commands:

```bash
# For PC:
$ mount a: C:turboc
$ mount c: C:dos

# For Mac
$ mount a: /Users/<username>/Desktop/turboc
$ mount c: /Users/<username>/dos
```

Once that has been completed your ready to install Turbo C into Dosbox. When you enter the command `a:` into Dosbox it should move to the virtual mount point you set for the a drive which should be our turboc directory with all the install files included within. Once there just enter `INSTALL` and you should be presented with the following screen.

![Install Turbo C on Dosbox - Step 1](/img/installing-turbo-c-on-dosbox-1.png "Install Turbo C on Dosbox - Step 1")

Once at this screen press Enter to go to the next step, the next screen as shown below will ask for the source drive which is the one with the install files on it. The default is A which is why we have already mounted the install files directory as A and the destination directory as C all you need to do is just press enter again here.

![Install Turbo C on Dosbox - Step 2](/img/installing-turbo-c-on-dosbox-2.png "Install Turbo C on Dosbox - Step 2")

Once you have followed the previous step you should be seeing the following screen shown below, select _"Install Turbo C onto a Hard Drive,"_ and press enter to go to the next step.

![Install Turbo C on Dosbox - Step 3](/img/installing-turbo-c-on-dosbox-3.png "Install Turbo C on Dosbox - Step 3")

Once you have selected the hard disk as destination make sure that the Turbo C directory is `C:\TC` as shown below which should be the default. If this is so then you should be able to press the down key until "Start Installation" is selected and press return.

![Install Turbo C on Dosbox - Step 4](/img/installing-turbo-c-on-dosbox-4.png "Install Turbo C on Dosbox - Step 4")

Now if everything has been done right the install app will begin installing Turbo C into the `C:\TC` directory as shown below and should complete with zero errors.

![Install Turbo C on Dosbox - Step 5](/img/installing-turbo-c-on-dosbox-5.png "Install Turbo C on Dosbox - Step 5")

You should then be able to press any key to quit the install app at which point typing the following commands will show you the newly installed copy of Turbo C on your Dosbox system:

```bash
# Use dir to list the content of c:
# You should see a directory called TC
c: dir

# Start Turbo C with the following commands:
c: cd TC
c: tc
```

![Install Turbo C on Dosbox - Step 6](/img/installing-turbo-c-on-dosbox-6.png "Install Turbo C on Dosbox - Step 6")

Congratulations, if you see the above screen then you have successfully installed Turbo C onto your Dosbox emulated dos machine. From now on you can create your own programs which will run natively under dos and even go so far as to compile them. This basic install comes with a readme package and some example scripts to learn from. To boot up the readme you just need to type in `readme` instead of `tc` to load the help app.

## Downloads

I have produced an easy to use package for those of you whom use osx. It contains Dosbox 0.72 and an install of Turbo C ready to go, it will open up just like any other application with one click as though you are running Turbo C native under osx. I hope it makes someones day at least, the icon for this app package came from [here](http://www.freeiconsdownload.com/Free_Downloads.asp?id=573).

* [Download packaged osx TURBOCAPP.zip](/files/turbocapp.zip) &ndash; 3,845KB
* [Download Turbo C installer tc201.zip](/files/tc201.zip) &ndash; 1,075KB
* [Installed version with examples on archive.org](https://archive.org/details/msdos_borland_turbo_c_2.01) &ndash; 11MB

### Documentation
While my downloadable package above automatically loads `tc` for you, the documentation that comes with Turbo C is still packaged along side it and should be accessible via F1 within tc, however you can stop the auto load by editing the `dosbox.conf` file within the app package.

I have found the following websites helpful in my understanding of Turbo C:

* [Porting Borland Turbo C source code to GNU gcc](http://www.sandroid.org/TurboC/index.html)

[^1]: At the time of this article being written this was freely available from [here](http://edn.embarcadero.com/article/20841#2HowtoDownloadTurboC). However it appears that they have put the download behind a sign-up wall - which while admittedly is free means I have mirrored a copy [here on Photogabble](/files/tc201.zip) for ease of access and for future prosperity if ever the original source goes away for good.