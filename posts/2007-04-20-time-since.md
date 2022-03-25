---
title: A time_since function for PHP
description: A simple time since function for PHP
categories: [programming]
tags: [php, revived]
growthStage: budding
---

I found it incredibly difficult to find any form of time_since function in php so to save anyone else the trouble to hunting through hundreds of useless websites here is the function you may want to use, written by [Natalie Downe](https://web.archive.org/web/20110424153613/http://natbat.net/2007/Jan/27/timesince/)[^1] (you don't want to know how long it took to hunt it down). It takes the input in the form of the unix time stamp.

```php
function time_since($original) {   
    // array of time period chunks
    $chunks = array(
        array(60 * 60 * 24 * 365 , 'year' ),
        array(60 * 60 * 24 * 30 , 'month' ),
        array(60 * 60 * 24 * 7, 'week' ),
        array(60 * 60 * 24 , 'day' ),
        array(60 * 60 , 'hour' ),
        array(60 , 'minute' ),
    );
    
    $today = time(); /* Current unix time */
    $since = $today - $original;
    
    // $j saves performing the count function each time around the loop
    for ($i = 0, $j = count($chunks); $i < $j; $i++) {
        $seconds = $chunks[$i][0];
        $name = $chunks[$i][1];
        
        // finding the biggest chunk (if the chunk fits, break)
        if (($count = floor($since / $seconds)) != 0) {
            // DEBUG print "<!-- It's $name -->n";
            break;
        }
    }
    
    $print = ($count == 1) ? '1 '.$name : "$count {$name}s";
    if ($i + 1 < $j) {
        // now getting the second item
        $seconds2 = $chunks[$i + 1][0];
        $name2 = $chunks[$i + 1][1];
    
        // add second item if it's greater than 0
        if (($count2 = floor(($since - ($seconds * $count)) / $seconds2)) != 0) {
            $print .= ($count2 == 1) ? ', 1 '.$name2 : ", $count2 {$name2}s";
        }
    }
    return $print;
}
```

I also found a second more compact version from [byteinsider](https://web.archive.org/web/20070314043355/http://byteinsider.com:80/article/short-and-accurate-time_since-php-function)[^2] their version (below) takes the input in the form of the MySQL timestamp format (`Y-m-d H:i:s`) both functions output the same type of thing tho, so its up to you which you use.

```php
function time_since($mysql_timestamp) {
    $names =  array('year','month','day','hour','minute','second');
    $r = time()-strtotime($mysql_timestamp) - date('Z');
    $posted = array(date('Y',$r)-1970,date('n',$r)-1,date('d',$r)-1, date('G',$r)-0,date('i',$r)-0,date('s',$r)-0);
    
    for($n = 0; $n < 5 && $posted[$n] == 0; $n++);
    $output = $posted[$n].' '.$names[$n];
    if($posted[$n] != 1) $output .='s';
    if($n < 5 && $posted[$n+1] != 0) {
        $output .= ' '.$posted[$n+1].' '.$names[$n+1];
        if($posted[$n+1] != 1) $output .='s';
    }
    return $output.' ago';
}
```

[^1]: In the many, many years since this article was written the original link for Natalie Downe's website has died. In this case the Wayback Machine has saved us by archiving the page for prosperity.
[^2]: The domain for Byteinsider seems to have been lost to domain squatters however the Wayback Machine saves us once again.