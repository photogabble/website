---
title: Writing a pixel editor in javascript - Part three
tags:
  - Programming
  - JavaScript
  - stage/evergreen
cover_image: /img/javascript-pixel-paint-9.png
aliases:
  - 'Stage three: Adding a preview'
---


![Pixel Editor](/img/javascript-pixel-paint-7.png)

In [[Writing a pixel editor in javascript - Part two|part two]] we finished the main image canvas and got to the point where you could draw onto the grid of pixels with one mouse button and erase with the other. In this, the third part, we shall be adding the preview to the pixel editor. You can grab all the files from this tutorial series [here at github](https://github.com/photogabble/pixel-editor-tutorial).

**Contents**

* [[Writing a pixel editor in javascript - Part one|Stage one: Setting up the application loop and listening to mouse input]]
* [[Writing a pixel editor in javascript - Part two|Stage two: 1-bit drawing to a 16x16 pixel canvas]]
* **[[Writing a pixel editor in javascript - Part three|Stage three: Adding a preview]]**
* [[Writing a pixel editor in javascript - Part four|Stage four: Adding a palette selector]]
* [[Writing a pixel editor in javascript - Part five|Stage five: Saving of images]]
* [[Writing a pixel editor in javascript - Part six|Stage six: Webpack, Linting and ES6]]
* Stage seven: Adding a paint bucket tool and undo history
* Stage eight: Writing a PHP backend to create a public library of images

As you can see from the below code the `Preview` object is quite simple, containing a handful of `private` members and just two `public` methods. In its constructor we create another canvas object which we will use to draw to before caching its image data to the `private.cCache` variable for rendering to the main DOM `<canvas>` element in the same way as our `ImageCanvas` object does.

```javascript
var Preview = function( options ){

    var private      = {};
    private.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
    private.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
    private.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 341, y: 295 };
    private.loaded   = false;
    private.cCanvas  = $('<canvas/>').attr({ width: 43, height: 36 });
    private.cContext = private.cCanvas.get(0).getContext("2d");
    private.cCache   = null;

    return {

        update: function( step, canvas, context ){

        },

        render: function( step, canvas, context ){

        }

    };

};
```

To begin place `var iPreview = new Preview();` on a new line after our declaration of `iCanvas` followed by `iPreview.render( step, canvas, context );` in the render method within `App` and `iPreview.update( step, canvas, context);`  inside the `App` update method, both on new lines after the calls to their `iCanvas` counterparts.

Next paste the above code before your `ImageCanvas` object declaration, refreshing the `index.html` file in your browser will do nothing different than before, and if all went well you will have no errors in your console.

Once you are sure you have copied everything correctly, paste the below code into your `Preview` objects render method. You should be quite familiar with the following lines as it is very similar to the method we used in our `ImageCnavas` object in part two.

```javascript
private.cContext.clearRect(0, 0, 43, 36);

private.cContext.font      = '10px Arial';
private.cContext.fillStyle = '#000000';
private.cContext.fillText( 'Preview', 3.5, 10);

private.cContext.fillRect( 13, 15, 18, 18);

private.cContext.fillStyle = '#FFFFFF';
private.cContext.fillRect( 14, 16, 16, 16);

private.cCache = private.cContext.getImageData( 0, 0, 43, 36);
private.loaded = true;
```

The `Preview.update` method begins by clearing the local private canvas context created by the constructor and writing the text "Preview" to it followed by drawing a black square with a slightly smaller white square over the top to provide a border around a 16x16 pixel preview area.

The render method of our `Preview` object is the below two lines. Because the render method can sometimes be called before the update method has finished executing we first check that the cache has been loaded before writing the stored image data to the context passed to it from our main render method in the `App` object.

```javascript
if ( ! private.loaded ){ return; }
context.putImageData( private.cCache, private.offset.x, private.offset.y );
```

![Pixel Editor](/img/javascript-pixel-paint-8.png)

Now upon refreshing `index.html` in your browser, you should see the above. As you can see from my doodle, the preview doesn't yet provide an *actual* preview of our drawn pixels; the object that stores our pixel data is privatly held within the `ImageCanvas` object and normally that would mean that it is hidden from access. Fortunatly however our `ImageCanvas` object has a getter that we can use to grab the pixel object from within it as shown in the following code snippet:

```javascript
var mPixels = iCanvas.get('pixels');

for (var y = 1; y <= private.yPixels; y+= 1)
{
    for (var x = 1; x <= private.xPixels; x+= 1)
    {
        var currentPixel = mPixels.getPixel( x, y);
        if ( currentPixel.on === true )
        {
            private.cContext.fillStyle = '#000000';
            private.cContext.fillRect( (14 + x - 1) ,( 16 + y - 1), 1, 1);
        }
    }
}
```

The above code belongs inside your `Preview` objects `update` method, between the line `private.cContext.fillRect( 14, 16, 16, 16);` and `private.cCache = private.cContext.getImageData( 0, 0, 43, 36);`. It is very similar to the double for loop used within the `ImageCanvas` object to output the big representation of the pixel data.

![Pixel Editor](/img/javascript-pixel-paint-9.png)

Upon refreshing `index.html` within your browser and drawing on the image canvas, you should now be able to see a preview of how your drawing looks, just as the above image shows. Now "1-bit" colour depth is all fun and games but what we really want to have is a choice of what colour we draw with.

Thank you so much for reading this tutorial, [[Writing a pixel editor in javascript - Part four|next in part four]] we will add a pallet selector to the application. If you have any comments, questions or suggestions please leave them below in the comment form, or drop me a tweet [@carbontwelve](https://twitter.com/carbontwelve).



