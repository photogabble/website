---

title: How to set composer global bin path in Windows
categories:
    - tools-and-resources
tags:
    - composer
    - windows 7
cover_image: /assets/img/windows-environment-variables.png
---

[Composer](https://getcomposer.org/) is not just amazing at managing PHP project dependencies on a per project level but is also able to install packages at a system wide level enabling you to keep such things as Laravel Installer[^1], PHPUnit[^2] and PHP_CodeSniffer[^3] up-to-date without touching [Pear](http://pear.php.net/).

The only problem with installing packages at a global level on Windows is that the directory that composer installs into is not[^4] set within your `%PATH%` variable and therefore is not available to you from the command line until you update your `%PATH%` variable.

When you request composer to install a package globally such as: `composer global require "laravel/installer=~1.1"` it will install the executable into `%APPDATA%\Composer\vendor\bin` therefore you need to first convert that into an absolute path and then append that to your `%PATH%` variable.

The absolute path that you use will be the following, replacing **USERNAME** with your user name:

> C:\Users\\**USERNAME**\AppData\Roaming\Composer\vendor\bin

To add the absolute path to your `%PATH%` variable go to *User Accounts* under your `Control Panel` and then with your user account selected, click on *Change my environment variables*. Doing so will open up a box similar to the one below:

![Windows Environment Variables](/assets/img/windows-environment-variables.png "Windows Environment Variables")

As you can see I already have a *PATH* variable set up for my user, with the Folding at home client, if you do not already have one set up for your user then you can click New and add it with the variable name being `PATH` and the variable value being the absolute path to your composer bin directory.

If you, as I do, already have a *PATH* variable set up in your users environment then you need to edit the existing one and append a `;` to previous value followed by the path to your composer bin directory as shown below:

> **;**C:\Users\\**USERNAME**\AppData\Roaming\Composer\vendor\bin

If you do not end the previous value with a semi-colon then bad things will happen. Once you have updated your `%PATH%`, the changes are imediate, however you need to restart any applications that might have been using it as they will have loaded the old variable before it was changed.

To test that your path has been updated you can open a new command window (`cmd`) and type `echo %path%`. This will output a half dozen lines of text to your terminal, the very end of which will be your amendments. 

I hope that someone might have had some help updating their Windows path variable by following what are essentially notes to my future self when I need to do this on a new computer &ndash; if you have any comments or questions, feel free to ask below or tweet me at [@carbontwelve](https://twitter.com/carbontwelve).

[^1]: `composer global require "laravel/installer=~1.1"`
[^2]: `composer global require "phpunit/phpunit=4.5.*"`
[^3]: `composer global require "squizlabs/php_codesniffer=*"`
[^4]: At the time of writing, the Windows installer for composer does not update your `%PATH%` variable to include its global install directory.