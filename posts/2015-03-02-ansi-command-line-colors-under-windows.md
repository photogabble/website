---

title: ANSI Command Line Colors under Windows

categories:
    - tools-and-resources
tags:
    - windows
    - command line
cover_image: /img/ansicon-install-cmd.png
---

Coming from a linux and osx background, the one thing that I missed the most when using windows was ANSI command line colours within the command prompt. ANSI escape sequences are supported in at least in one form or another in most terminal emulators except for the win32 console component of Microsoft Windows. Fortunately there is a project on github [adoxa/ansicon](https://github.com/adoxa/ansicon) that adds support for ANSI escape sequences to the Windows console by wrapping it and adding interpreting the ANSI sequences.

As of writting version 1.66 is the *latest*[^1] release of ANSICON and can be obtained from the [github repository here](https://github.com/adoxa/ansicon/releases). There have been 16 commits to the master repository since the 1.66 release and if you know how to compile the project from source then you will be able to run with version 1.70[^2].

![Installing Ansicon](/img/ansicon-install.png "Installing Ansicon")

To begin download and extract the ansi166.zip from [github](https://github.com/adoxa/ansicon/releases). Then, if you have a 32-bit version of Windows copy the `x86` directory to `C:\` or `x64` if you have 64-bit Windows. Next rename the copied directory to `ansicon` then with it selected in file explorer hold the [shift] key and right click on the `ansicon` directory to bring up the context menu. From the menu click *open command window here*[^3].

Running `ansicon.exe -i` from the newly opened command window will install ansicon into your system[^4]; it can just as easily be un-installed by running with the `-u` flag like so `ansicon.exe -u`. 

Alternatively if you are unable to install ansicon due to restrictions placed upon your computer that are out of your control simply running `ansicon.exe` will open a new command window[^5] wrapped by ansicon and supporting ANSI escape sequences. 

Once you have completed either of the above methods you should now be able to enjoy coloured output of command line tools, for example composer:

![ANSI escape sequences in Windows command window](/img/ansicon-install-cmd.png "ANSI escape sequences in Windows command window")

[^1]: Version 1.66 of ANSICON was released on the 19th September 2013
[^2]: Version 1.70 of ANSICON was released on the 26th February 2014 but requires compiling from the supplied source.
[^3]: Alternatively you can do `cd C:\ansicon` but you probably already knew that&hellip;
[^4]: It does this by adding an entry to the autorun registry valye for `cmd.exe`
[^5]: When `ansicon.exe` is run directly it will load and wrap the command window as defined in the environment variable `%ComSpec%` which is usually but not always `C:\Windows\system32\cmd.exe`