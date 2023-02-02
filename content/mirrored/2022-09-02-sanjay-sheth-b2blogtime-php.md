---
title: "Mirror of B2BlogTime.php by Sanjay Sheth"
tags:
  - PHP
  - Blogtimes
  - Wayback Machine
---

Code snippet sourced from this [Wayback Machine copy from the now defunct sastools.com](https://web.archive.org/web/20040815143403/http://sastools.com:80/b2/b2blogtime.php.txt).

```php
<?php

# File:    B2BlogTime.PHP
# Purpose: To generate a bar graph showing when posts are made during a period of time
# Author:  Sanjay Sheth ( blog@sastools.com )

# b2config.php gives us db table names & passwords 
include_once('b2config.php');

# b2functions.php gives us mysql_query and mysql_fetch_object and dbconnect
include_once($b2inc.'/b2functions.php');

# Main function to invoke to generate the bar graph
# pass it the width/height/padding/title that you want
function updateBlogTimePNG($saveFile,$last_x_days=30,
                           $width=480,$height=45,$horzpadding=5,$vertpadding=5,
                           $show_ticks=1,
                           $title="Blog Post Times")
{
    # constants defining image
    $fontheight = ImageFontHeight(2);
    $fontwidth  = ImageFontWidth(2);
    $monthtext = "Last $last_x_days days";
    $unitname = "hour of day";
    $show_units = 1;

    # create the basic image
    $im = @ImageCreate ($width, $height)
       or die ("Cannot create a new GD image.");

    # generate some colors
    $white      = ImageColorAllocate ($im, 255,255,255);
    $black      = ImageColorAllocate ($im, 0,0,0);
    $beige      = ImageColorAllocate ($im, 247,243,235);
    $blue       = ImageColorAllocate ($im, 0,0,255);
    $silver     = ImageColorAllocate ($im, 0xE0,0xE0,0xE0);

    # define what color to use where
    $back_color = $white;    # this is background of entire image (text & all)
    $box_color  = $beige;    # this is background of just the posts box
    $text_color = $black;
    $line_color = $blue;     # this is color of lines for each post
    $border_color = $black;

    # query the db and build the list
    $posttimes = getPostTimes(30);

    # calculate how many intervals to show
    $intervals = floor( ($width / 40) );
    if ($intervals >= 24) $i_mod = 1;
    else if ($intervals >= 12) $i_mod = 2;
    else if ($intervals >= 8) $i_mod = 3;
    else if ($intervals >= 6) $i_mod = 4;
    else if ($intervals >= 4) $i_mod = 6;
    else if ($intervals >= 3) $i_mod = 8;
    else if ($intervals >= 2) $i_mod = 16;
    else $i_mod = 24;

    # fill the image with the background color
    ImageFill($im, 0, 0, $back_color);

    # create a filled  rectangle with a solid border
    $left = $horzpadding; $right = $width - $horzpadding;
    $top = $fontheight + $vertpadding;
    $bottom = $height - $vertpadding - $fontheight;

    if ($show_units)
        $bottom -= $fontheight;

    ImageFilledRectangle($im, $left,$top,$right,$bottom, $box_color);
    ImageRectangle($im, $left,$top,$right,$bottom, $border_color);

    # write title and monthtext
    ImageString($im, 2, $left, 0, $title,$text_color);
    $txtwidth = strlen($monthtext) * $fontwidth;
    ImageString($im, 2, $right - $txtwidth, 0,$monthtext,$text_color);

    # add the legend on the bottom
    for ($i = 0; $i <= 23; $i=$i+1)
    {
        if ($i % $i_mod == 0) {
            $curX = $left + ($right - $left)/24 * $i;

            if ($i > 9) {$strX = $curX - 5;}
            else        {$strX = $curX - 2;}

            ImageString($im, 2, $strX , $bottom, $i, $text_color);
            if ($show_ticks)
                ImageLine($im, $curX, $bottom, $curX, $bottom - 5, $tick_color);
        }
    }
    ImageString($im, 2, $right - 5, $bottom,  0, $text_color);
    if ($show_units) {
        $curX = ($right + $left) / 2 - ($fontwidth * strlen($unitname)/2);
        $curY = $bottom + $fontheight + 2;
        ImageString($im, 2, $curX, $curY, $unitname, $text_color);
    }

    # now we draw the lines for each post
    # the post times should be in terms of # of minutes since midnight
    $arrcount = count($posttimes);
    for ($i = 0; $i < $arrcount; $i++)
    {
        # make sure postTime is between 0 and 1439
        $curPostTime = abs($posttimes[$i]) % 1440; 
        
        # calculate the horz pos inside box              
        $curX = $left + ($right - $left)/1440 * $curPostTime;    # 1440 minutes per day

        # draw the post line
        ImageLine($im, $curX, $bottom, $curX, $top, $line_color);
    }

    # save the file to disk in PNG format 
    ImagePNG ($im,$saveFile);
}

# This function will query the db for all the posts in last x days
# and build an array of # of minutes since midnight for each post
function getPostTimes($last_x_days=30)
{

    $sql  = "SELECT HOUR(post_date)*60+MINUTE(post_date) AS totmins ";
    $sql .= " FROM b2posts ";
    $sql .= " WHERE (TO_DAYS(CURRENT_DATE) - TO_DAYS(post_date)) <= $last_x_days ";
    $sql .= " ORDER BY totmins ASC";

    $result = mysql_query($sql)
       or die("Your SQL query: <br />$sql<br /><br />MySQL said:<br />".mysql_error());

    while($row = mysql_fetch_object($result)) {
      $postTimes[] = $row->totmins;
    }
    
    return $postTimes;
}

# I build the image once an hour via a crontab call of this file
# so the function call is done right here itself.
dbconnect();
updateBlogTimePNG('b2-img/blogtime.png',30,480,65,5,5,0);
?>
```