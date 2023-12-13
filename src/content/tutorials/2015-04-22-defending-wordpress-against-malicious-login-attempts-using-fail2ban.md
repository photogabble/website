---
title: Defending WordPress against malicious login attempts using fail2ban
tags:
  - Blogging
  - PHP
  - Linux
  - Wordpress
cover_image: /img/fail2ban-regex.png
growthStage: budding
---

![WordPress Jetpack malicious login attempts](/img/wordpress-jetpack-malicious-login-attempts.png "Wordpress Jetpack malicious login attempts")

Day to day I quite often develop for and work with self hosted WordPress installs, a number of which I host myself; all of the installs that I manage have the Jetpack plugin by Automattic installed which alongside the many beneficial features it provides, also tells you in your dashboard how many malicious login attempts have been blocked.

Now that number (*413 in the above screenshot*) can look alarmingly high to anyone who doesn't already realise that any publicly facing, internet connected device faces the risk of a continual onslaught of attempted attacks from a variety of sources. For those of you up until this sentence thinking it was high, it's not, however the number of malicious login attempts against one of the WordPress powered sites is not the subject of this article, defending WordPress against them using fail2ban is.

While Jetpack words the status as "**blocked** malicious login attempts," I wanted to add another layer of security before that in the form of a fail2ban jail. Fail2ban is a service that you configure to watch log files and block ip addresses via the firewall based upon rules that you define e.g. too many login attempts. Out of the box fail2ban has rules that can protect services such as ftp and ssh from bruit force login attempts and it is very easy to write your own if you know a little bit of regex[^1].

If you haven't already got [fail2ban](http://www.fail2ban.org/wiki/index.php/MANUAL_0_8) installed you can do it from your linux package manager, in Debian (and Debian derivatives such as Ubuntu) it is the following command[^2]:

```
    sudo apt-get install fail2ban
```

For more detailed information on installing fail2ban (on Debian or derivative thereof) please [visit this link](https://www.digitalocean.com/community/articles/how-to-protect-ssh-with-fail2ban-on-ubuntu-12-04).

## Identifying attacks

Wordpress, for reasons only known by the core team[^3] will always respond to an invalid authentication attempt with a `200 OK` status code rather than a `403 Forbidden`. What this means is that from looking at your server logs alone you are unable to determine a legitimate log in from a failed attempt; fortunately WordPress has a `wp_login_failed` event that the following simple mu-plugin[^4] code hooks into and changes the status header.

```php
function my_login_failed_403() {
    status_header( 403 );
}
add_action( 'wp_login_failed', 'my_login_failed_403' );
```
In your `wp-content/mu-plugins` (or where ever you have configured your mu-plugins directory to be, I am looking at you [roots bedrock](https://roots.io/bedrock/) users) create a new file called `security.php` and paste the above code after prepending it with `<?php`. Once installed you will start seeing 403 errors in your log for every failed login like so:

```
[03/Apr/2015:05:58:01 +0100] "GET /wp-login.php HTTP/1.1" 403 3069 "-" "Mozilla/5.0 (Windows NT 6.1; rv:36.0) Gecko/20100101 Firefox/36.0"
```

## Fail2ban Wordpress Definition

Now that failed login attempts are easily identified you can define a new filter. In the folder `/etc/fail2ban/filter.d/` create a new file called `wordpress-auth.conf` and paste the following into it:

```ini
# WordPress brute force auth filter: /etc/fail2ban/filter.d/wordpress-auth.conf:
# Block IPs trying to auth wp wordpress
#
# Matches e.g.
# 10.20.30.40 - [21/Apr/2015:21:18:42] "POST /wp/wp-login.php HTTP/1.0" 403 4521
# 15.27.31.45 - [21/Apr/2015:21:18:46] "POST /wp/xmlrpc.php HTTP/1.0" 403 4521
#
[Definition]
failregex = <HOST>.*POST.*(wp-login\.php|xmlrpc\.php).* 403
ignoreregex =
```

Once the filter has been created you need to then create `/etc/fail2ban/jail.local` if it doesn't already exist &ndash; some installs do not create it by default by fail2ban will load it if it exists.

Within `jail.local` paste the following:

```ini
[wordpress]

enabled  = true
port     = http,https
filter   = wordpress-auth
logpath  = /srv/vhosts/example.com/logs/access.log
maxretry = 8
bantime  = 3600
```

**The above translatates to:** Initiate a new jail called `wordpress` enable it on both `http` and `https` using the filter defined as `wordpress-auth` against the logfile found at `/srv/vhosts/example.com/logs/access.log`; if there are `8` or more failed attempts (matches against the `wordpress-auth` filter) then black list the host for `3600` seconds (1 hour.)[^5]

You will need to change the `logpath` entry from the example I have shown in the snippet above to the location of your WordPress blogs access log as output by your web server[^6]. Once configured you can test the filter by using the `fail2ban-regex` command line tool using the following syntax:

`fail2ban-regex <logfile> <fail2ban filter to test>`

To use `fail2ban-regex` on the sample log file shown above with the new `wordpress-auth` filter you would execute the following on your terminal:

`fail2ban-regex /srv/vhosts/example.com/logs/access.log /etc/fail2ban/filter.d/wordpress-auth.conf`

The length of time that the test takes will be dependant upon the size of the log file being tested against, if you do not already do so, I would *recommend* the setting up of logrotate for your log files. Once the test is complete you will see output on your terminal looking something like the below:

![fail2ban-regex output](/img/fail2ban-regex.png "fail2ban-regex output")

So long as the output finishes with *"Success, the total number of match is"* followed by the number of any matches, then the filter has passed the test. You can always, if you havent already do a failed log in to your wordpress install to see the count of matches increase; however so long as the test finishes with a success there is no need.

## Restart fail2ban and verify

Once you are happy that the filter is working you can restart the fail2ban service by executing the command `sudo service fail2ban restart` and check that the fail2ban rule is active in iptables[^7] by executing the command `sudo iptables -vnL`. Within the iptables output under the target column you should see a `fail2ban-wordpress` rule which shows that fail2ban is working correctly with the iptables firewall.

## Caveats

This method works, and it works well. However you will need to create a jail for each unique access log; meaning if you have ten WordPress installs with ten separate access logs you will need ten fail2ban jails &ndash; something that can get quite monotonous and possibly slow fail2bans performance. This can be easily remedied by creating a shared login access log that all of your WordPress installs write to. In the future I will be writing on how I went about implementing this using [PHP openlog](http://php.net/manual/en/function.openlog.php#refsect1-function.openlog-parameters); until then, if you have any questions or feedback please do leave a comment below.

[^1]: For the record, I know just enough regex not to shoot myself in the foot with it, but not enough to be considered a guru.
[^2]: Or drop the `sudo` if your running as root
[^3]: [This](https://core.trac.wordpress.org/ticket/25446) ticket explains a little bit more about the thinking behind the 200 response;
[^4]: mu-plugins are must use plugins and will always be loaded by WordPress, [click here to read more](https://codex.wordpress.org/Must_Use_Plugins)
[^5]: fail2ban uses the `bantime` as the duration in which the max re-trys can be done within, so this also translates to no more than 8 failed attempts in one hour
[^6]: The filter I have included is designed to work with the default nginx access log format, it shouldn't be difficult to change it to work for Apache, if in doubt refer to foot note #1
[^7]: I am assuming that you have fail2ban configured to use iptables, if you have configured it otherwise then I also assume that you know what you are doing and are therefore simply visiting this page for reference.
