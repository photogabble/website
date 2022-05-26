---
title: Writing a pixel editor in javascript - Part five
tags:
  - Programming
  - JavaScript
cover_image: /img/javascript-pixel-paint-12.png
draft: false
growthStage: budding
---

![Pixel Editor](/img/javascript-pixel-paint-11.png "Pixel Editor")

In [part four](/blog/2015/05/08/writing-a-pixel-editor-in-javascript-p4/) we finished adding the pallet and colour selector to our pixel editor. In this, the fifth part, we shall be cleaning up the code, placing it within its own IIFE and making it strict mode compliant followed by adding the ability to save the images that are created with it.

**Contents**

* [Stage one: Setting up the application loop and listening to mouse input](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/)
* [Stage two: 1-bit drawing to a 16x16 pixel canvas](/blog/tutorials/writing-a-pixel-editor-in-javascript-p2/)
* [Stage three: Adding a preview](/blog/tutorials/writing-a-pixel-editor-in-javascript-p3/)
* [Stage four: Adding a palette selector](/blog/tutorials/writing-a-pixel-editor-in-javascript-p4/)
* [Stage five: Saving of images](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/)
* [Stage six: Webpack, Linting and ES6](/blog/tutorials/writing-a-pixel-editor-in-javascript-p6/)
* Stage seven: Adding a paint bucket tool and undo history
* Stage eight: Writing a PHP backend to create a public library of images

### What is JavaScript strict mode?
Within the JavaScript specification ECMAScript 5, you can opt in to a *strict* mode by adding `"use strict";` as the first statement within a given scope. The purpose of this is first: to eliminate some of the silent errors that non-strict JavaScript hides, secondly: make JavaScript engines better able to perform optimisations and thirdly: to prohibit syntax likely to conflict with that to be defined in future versions of ECMAScript.[^1]

We are interested in strict mode for our application simply because it will allow us to catch errors now that fail silently that may cause trouble with future versions of ECMAScript and it may also provide us with improved performance on certain devices.

By inserting `"use strict";` as the first line in our `app.js` we will notice that everything breaks (we will be encapsulating this within a IFFE[^2] shortly); a quick glance at the browsers console gives us the following helpful error:

```
    Uncaught SyntaxError: Unexpected strict mode reserved word   app.js:6
```

The error is referring to our use of the now restricted word `private` as a variable name[^3]. This is a quick fix, all you need to do is a find and replace on the word `private` and replace it with one that is not a reserved word &ndash; you will notice in the [github repository](https://github.com/photogabble/pixel-editor-tutorial) that I chose to use `privateVars`.

Once that is done you will notice that the same error appears in the console, albeit on line 14 rather than 6; this is caused by our use of another reserved keyword, this time `public`. As with the reserved keyword `private` execute a find and replace on it to a non reserved word, I prefer to use `publicVars`.

Having done the above you will now notice that upon refreshing your `index.html` the pixel editor is back up and working. However because we placed `"use strict";` in the global scope of our script this may cause issues if you concatenate `app.js` with any other JavaScript file because our voluntary use of strict mode will then become imposed upon any other scripts yours is concatenated with. To stop this from becoming a problem we shall encapsulate our code in a IIFE[^2] and restrict strict mode to its scope.

### What is a IIFE?
IIFE stands for an **I**mmediately-**I**nvoked **F**unction **E**xpression; just as its name says, it is a function expression that gets invoked immediately. See the below modified example of an IIFE taken from [Greg Frankos slides on jQuery Best Practices](http://gregfranko.com/jquery-best-practices/#/8) and for more detailed information [read this article by Ben Alman](http://benalman.com/news/2010/11/immediately-invoked-function-expression/):

```javascript
    // IIFE - Immediately Invoked Function Expression
    (function($, window, document, undefined) {
        "use strict";

        // Strict mode is now enabled within this scope and 
        // the $ is now locally scoped.

        // Listen for the jQuery ready event on the document
        $(function() {
            // The DOM is ready!
        });

        // The rest of the code goes here!

    }(window.jQuery, window, document));
    // The global jQuery object is passed as a parameter
```

The nameless function in the above code example gets immediately invoked with three arguments passed in. You may notice that the function signature has four parameters, the last of which named `undefined`, I personally do this to ensure that `undefined` is indeed *undefined* because `window.undefined` is mutable and therefore any other script you use could set its value for their own purposes[^4].

To encapsulate our application within an IIFE simply insert `(function($, window, document, undefined) {` before where we put `"use strict";` then append with the closing `}(window.jQuery, window, document));` after the last line of `app.js` &ndash; sandwiching our application code between the two.

Finally before we begin adding the new functionality we aught to tidy up the code and execution order a little bit. For example `App.run` should only begin to execute once the DOM is ready to be manipulated, we can ensure this happens at the right time by invoking `App.run` within jQueries `$('document').ready` as shown by the below code example:

```javascript
    $('document').ready(function(){
        // Now that the DOM is ready, we can initiate our application
        var mainCanvas = $('#paintMe');

        App.run({
            canvas: mainCanvas,
            // ...
        });
    });
```

In addition to wrapping the `App.run` within jQueries `$('document').ready` you will notice from the above example that I have defined `mainCanvas` as being the result of `$('#paintMe')`. The reason for this is to reduce the number of duplicated jQuery selectors which can slow down bigger applications and while it doesn't matter for the purpose of our application, it is always good to implement best practice. To do this within our application we can cut all the mouse input event collectors (the ones begining with `$('#paintMe').on`) that we wrote during [part one](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/) and paste them into the jQuery document ready closure on a line between the `mainCanavs` definition and `App.run`. Once pasted, replace their `$('#paintMe')` with `mainCanvas`.

### Exporting to png

Adding the ability for a user to save the image that they have created with our pixel editor is made quite simple thanks to the [toDataURL()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) method existing on canvas elements[^5]. We shall begin adding this functionality by first adding a save button to our interface.

In order to keep things simple, for the time being we shall be using a regular DOM button element to trigger the export event. To do so modify your `index.html` file to add the following below the canvas tag within the div `canvasContainer`:

```html
<button id="saveBtn">Save</button>
```

Then so that the button is positioned correctly, now modify the css in the page header for `#canvasContainer` to equal the below:

```css
#canvasContainer{
  width: 394px;
  height: 375px;
  margin: 100px auto;
  position: relative;
}

#canvasContainer button{
  position: absolute;
  bottom: 12px;
  left: 10px;
}
```

Next in order to export the image as a 16x16 png we need to create a new temporary canvas object[^6]. Then, looping over the pixels stored in `ImageCanvas` draw the image to the temporary canvas before using its `toDataURL()` method to prompt downloading the image as a file by the browser.

This is done by re-purposing the code we used for the preview in [part three](/blog/tutorials/writing-a-pixel-editor-in-javascript-p3) and then creating a temporary link with the canvas `toDataURL` result as its `href` before triggering a click event to prompt the browser to download the image.

```javascript
$('#saveBtn').on('click', function () {
    var cCanvas = $('<canvas/>').attr({width: 16, height: 16});
    var cContext = cCanvas.get(0).getContext("2d");
    var mPixels = iCanvas.get('pixels');

    for (var y = 1; y <= 16; y += 1) {
        for (var x = 1; x <= 16; x += 1) {
            var currentPixel = mPixels.getPixel(x, y);
            if (currentPixel.on === true) {
                cContext.fillStyle = currentPixel.colour;
                cContext.fillRect((x - 1), (y - 1), 1, 1);
            }
        }
    }

    var link = document.createElement('a');
    link.download = 'image.png';
    link.href = cCanvas.get(0).toDataURL("image/png");
    link.click();
});
```

The above code belongs within the `$(document).ready(function(){` block of your code, if you look at the [source for this tutorial](https://github.com/photogabble/pixel-editor-tutorial/tree/master/step%20five)) you can see that I have placed it before the line containing `App.run({`.

For security reasons if we do not set the `download` property on the temporary link. Chrome (and likely all other modern browsers) will log the following error _"Not allowed to navigate top frame to data URL:"_.

![Pixel Editor](/img/javascript-pixel-paint-12.png "Pixel Editor")

Now upon refreshing `index.html` in your browser, you should see the above, and upon clicking the save button your browser should prompt to download a png image.

Thank you so much for reading this tutorial, next in part six, we will refactor the JavaScript into ES6 and use [Webpack](https://webpack.js.org/) to build the project.

[^1]: Source: [MDN - Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
[^2]: Immediately-invoked function expression, for more information [read this article by Ben Alman](http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
[^3]: In strict mode a short list of identifiers become reserved keywords, these words are: `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`, and `yield`.
[^4]: You can do `undefined = 2;` in JavaScript, if you are a monster troll. With that said beyond my method of ensuring `undefined` is *undefined* within my IIFE's you should check for undefined using `if( typeof yourVariable === 'undefined' ) {...}`
[^5]: It exists in the majority of modern browsers... not in IE before version 9.
[^6]: There are ways of doing so by reusing existing canvas objects, however I will leave that as an exercise for the reader
