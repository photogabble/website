---
title: "Mirror of blogtimes.php by Matt Mullenweg"
tags:
  - PHP
  - Blogtimes
---

Code snippet sourced from this [Wordpress plugin repository](https://plugins.trac.wordpress.org/browser/blogtimes/trunk/blogtimes.php), last touched by its author Matt Mullenweg in 2005. This is the second plugin to be written for WordPress as a port of B2BlogTime.php by Sanjay Sheth, a piece of computing history!

```php
<?php

/*
Plugin Name: Blogtimes
Plugin URI: http://dev.wp-plugins.org/wiki/BlogTimes
Description: This plugin generates a bar graph image showing when posts are made during a period of time. For this to work <code>wp-images/blogtimes.png</code> must be writable by the web server. Original code by Sanjay Sheth of sastools.com.
Author: Matt Mullenweg
Author URI: http://photomatt.net/
Version: 0.2
*/ 


// Change the defaults to modify anything
function updateBlogTimePNG($dummy = 'placeholder', $saveFile = '', $last_x_days = 30,
	$width = 480, $height = 65, $horzpadding = 5, $vertpadding = 5,
	$show_ticks = 1, $title = "Blog Post Times") {

	if (!$saveFile) $saveFile = ABSPATH . 'wp-images/blogtimes.png';
    // constants defining image
    $fontheight = ImageFontHeight(2);
    $fontwidth  = ImageFontWidth(2);
    $monthtext = "Last $last_x_days days";
    $unitname = "hour of day";
    $show_units = 1;

    // create the basic image
    $im = @ImageCreate ($width, $height)
       or die ('Cannot create a new GD image.');

    // generate some colors, format: RED, GREEN, BLUE
    $white      = ImageColorAllocate ($im, 255,255,255);
    $black      = ImageColorAllocate ($im, 0,0,0);
    $beige      = ImageColorAllocate ($im, 238,238,238);
    $blue       = ImageColorAllocate ($im, 102,102,102);
    $silver     = ImageColorAllocate ($im, 0xE0,0xE0,0xE0);

    // define what color to use where
    $back_color = $white;    # this is background of entire image (text & all)
    $box_color  = $beige;    # this is background of just the posts box
    $text_color = $black;
    $line_color = $blue;     # this is color of lines for each post
    $border_color = $black;

    # query the db and build the list
    $posttimes = getPostTimes($last_x_days);

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
function getPostTimes( $last_x_days = 30 ) {
	global $wpdb, $tableposts;

    $result = $wpdb->get_results("
		SELECT HOUR(post_date)*60+MINUTE(post_date) AS totmins
		FROM $tableposts 
		WHERE (TO_DAYS(CURRENT_DATE) - TO_DAYS(post_date)) <= $last_x_days 
		AND post_status = 'publish'
		ORDER BY totmins ASC
		");

    foreach ($result as $row) {
      $postTimes[] = $row->totmins;
    }
    
    return $postTimes;
}


add_action('publish_post', 'updateBlogTimePNG');
?>
```