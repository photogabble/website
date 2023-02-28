---
title: "PHP multi-version install with Homebrew"
tags: ["PHP", "Homebrew"]
growthStage: budding
---

## Preface
I use [Homebrew](https://brew.sh/) on my Macbook Pro to install PHP via the [Homebrew PHP Formula](https://formulae.brew.sh/formula/php). For many good reasons Homebrew by default installs the current stable version of PHP and quickly depreciates support for older versions, ultimately removing them. 

{% figure "/img/php-multiversion-with-homebrew-1.png" "Fig.1. 7.2-7.4 are end of life, 8.0 is security fixes only and 8.1-8.2 are in active support" "Histogram of PHP support over time, shows PHP 7.2 to 7.4 are no longer supported, 8.0 is only receiving security patches, 8.1 and 8.2 are actively supported" %}

For example at time of writing the php stable version is *8.2.3* and Homebrew supports installing `php@8.1` for version *8.1.15* and will allow installing `php@8.0` but with a depreciation warning. This largely looks to keep in line with PHP's active support timeline.

I don't just work on latest PHP some projects I work on require a large refactor[^1] to get off of *7.3* and so I use the [shivammathur/php brew tap](https://github.com/shivammathur/homebrew-php) to install `php@7.3` and `php@7.4` for PHP versions.

## Switching PHP Versions
In order to quickly switch between installed PHP versions I followed Andreas Möller's instructions for [Switching PHP versions when using Homebrew](https://localheinz.com/articles/2020/05/05/switching-php-versions-when-using-homebrew/). The meat of it is adding the following to your `.zshrc` or equivalent file:

```bash
installedPhpVersions=($(brew ls --versions | ggrep -E 'php(@.*)?\s' | ggrep -oP '(?<=\s)\d\.\d' | uniq | sort))
for phpVersion in ${installedPhpVersions[*]}; do
	value="{"
  for otherPhpVersion in ${installedPhpVersions[*]}; do
    if [ "${otherPhpVersion}" = "${phpVersion}" ]; then
      continue
    fi

    # unlink other PHP version
    value="${value} brew unlink php@${otherPhpVersion};"
  done

  # link desired PHP version
  value="${value} brew link php@${phpVersion} --force --overwrite; } &> /dev/null && php -v"

  alias "${phpVersion}"="${value}"
done
```

Which checked with `alias | grep php` yields (for me):

```
7.3='{ brew unlink php@7.4; brew unlink php@8.2; brew link php@7.3 --force --overwrite; } &> /dev/null && php -v'

7.4='{ brew unlink php@7.3; brew unlink php@8.2; brew link php@7.4 --force --overwrite; } &> /dev/null && php -v'

8.2='{ brew unlink php@7.3; brew unlink php@7.4; brew link php@8.2 --force --overwrite; } &> /dev/null && php -v'
```

The downside of this is that this aliasing happens upon every new terminal and so you have to wait a few seconds before its usable. However, I have yet to find a better dynamic solution.

## Installing xDebug with pecl
For each PHP install I use pecl for installing xDebug, however for some reason it gets confused when homebrew updates the default PHP install. For example I installed xDebug using `pecl install xdebug`  against the default *8.1* install of PHP. Homebrew later updated that to *8.2* uninstalling *8.1*. Attempting to install xdebug again would result in pecl returning:

```
pecl/xdebug is already installed and is the same as the released version 3.2.0
install failed
```

I confirmed with `pecl config-get ext_dir` and `php -i | grep 'PHP API'` that pecl was pointing at the right extension dir and that the extension dir was empty!

It's likely that pecl has some central cache somewhere but the only way I could get pecl to install again for PHP 8.2 was using its `--force` flag:

```
$ pecl install --force xdebug
```

[^1]: Currently ongoing and due to be completed this year
