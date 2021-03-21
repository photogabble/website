---

title: Writing a pixel editor in javascript - Part two
categories:
    - tutorials
tags:
    - programming
    - javascript
cover_image: /assets/img/javascript-pixel-paint-7.png
---

![Pixel Editor](/assets/img/javascript-pixel-paint-3.png "Pixel Editor")

In [part one](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/) we set the stage to begin writing our 16x16 pixel editor, if all went well you will hopefully be looking at something very similar to the above, a rather unassuming white square on a grey background. While it may not look like much, it is certainly progress and a excellent foundation on which to continue.

**Contents**

* [Stage one: Setting up the application loop and listening to mouse input](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/)
* [Stage two: 1-bit drawing to a 16x16 pixel canvas](/blog/tutorials/writing-a-pixel-editor-in-javascript-p2/)
* [Stage three: Adding a preview](/blog/tutorials/writing-a-pixel-editor-in-javascript-p3/)
* [Stage four: Adding a palette selector](/blog/tutorials/writing-a-pixel-editor-in-javascript-p4/)
* [Stage five: Saving of images](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/)
* [Stage six: Webpack, Linting and ES6](/blog/tutorials/writing-a-pixel-editor-in-javascript-p6/)
* Stage seven: Adding a paint bucket tool and undo history
* Stage eight: Writing a PHP backend to create a public library of images

###Image data structure
Now that we have our basic application framework built, we need a data-store for all the pixels that will make up the 16x16 pixel image, to do this I  have opted for a one dimensional array contained within the following JavaScript object.

```javascript
// Image is a reserved word in JavaScript so I use Pixels instead
var Pixels = function( options )
{
    // Private Properties & Methods
    var private      = {};
    private.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
    private.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
    private.pixelH   = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
    private.pixelW   = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;
    private.pixels   = [];

    // Public Properties & Methods
    var public      = {
        reset: function()
        {
            for (var y = 1; y <= private.yPixels; y += 1)
            {
                for (var x = 1; x <= private.xPixels; x += 1)
                {
                    this.setPixel(
                        x, y, {
                            mouseOver: false,
                            on: false,
                            x: ((x - 1) * private.pixelW),
                            y: ((y - 1) * private.pixelH),
                            h: private.pixelH,
                            w: private.pixelW
                        }
                    );
                }
            }
        },
        setPixel: function( row, col, value )
        {
            private.pixels[ private.xPixels * row + col ] = value;
        },

        getPixel: function( row, col )
        {
            return private.pixels[ private.xPixels * row + col ];
        },

        getPixels: function()
        {
            return private.pixels;
        },

        setPixels: function( pixels )
        {
            private.pixels = pixels;
        }
    };

    public.reset();
    return public;
};
```

**width & height properties:**
These each default to 16 and are implicitly set, as we are developing a 16x16 pixel image editor there is no immediate need to add both a `width` and `height` property to the `Pixels` data-store, but it is always useful to think ahead at what it could be used for and adding them now even if we are just using the `width` property is good future-proofing for when you may want to make it a less restrictive editor.

**Private pixelWidth & pixelHeight properties:**
These each will be used for rendering each pixel to the HTML `<canvas>`.

**Public setPixel & getPixel methods:**
These are the belts and braces of the Pixels data-store as it is these two methods that translate a two-dimensional `(x,y)` coordinate into a one-dimensional array key.

**Public setPixels & getPixels methods:**
The role of these two methods will become clear when I explain the `ImageCanvas` object.

**Public reset method:**
The reset method initiates the `pixels` array and can be used to clear the users drawing canvas on request. 

---

Looking at the way that each pixel is stored you will notice we store six pieces of data, the `(x,y)` position of the pixel on the editable image canvas, each pixels width and height for rendering, a boolean `on` flag for when the pixel is *on* and a boolean `mouseOver` flag for when the mouse is hovering the current pixel. Also looking at the way each pixel is stored you may also notice how trivial it will be to remove the arbitrary 1-bit colour depth limit that I have imposed for the purpose of this tutorial.

###Image Canvas

Don't get the image canvas confused with the HTML `<canvas>` tag as they are two different entities. The *image canvas* is our wrapper for the `Pixels` data-store and will render the content of the pixels to the HTML `<canvas>` via its 2D context.

```javascript
var ImageCanvas = function( options )
{
    
    // Private Properties & Methods
    var private      = {};
    private.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
    private.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
    private.pixelH   = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
    private.pixelW   = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;

    private.pixels   = new Pixels( {
        xPixels: private.xPixels,
        yPixels: private.yPixels,
        pixelW: private.pixelW,
        pixelH: private.pixelH
    });

    // Public Properties & Methods
    return {

        // Public getter
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
            }
        },

        load: function ( pixels )
        {
            // ...
        },

        save: function ()
        {
            // ...
        },

        update: function ( step, canvas, context )
        {
            // ...
        },

        render: function ( step, canvas, context )
        {
            // ...
        }
    };
};
```

The `ImageCanvas` object is similar in structure to the `Pixels` object in that it has private and public properties and methods. It also initiates an instance of the `Pixels` object when it, itself is initiated. For simplicity I have named the shared properties the same thing so you should already have a good idea of what is going on here.

The `update` method of the `ImageCanvas` object needs to be executed each and every time the main `update` method executes, so scroll up to the applicable point within your `app.js` and paste the following just after the mouse event handling code we finished on in stage one.

```javascript
iCanvas.update( step, canvas, context );
```

Also add the following into the `App.render` method:

```javascript
iCanvas.render( step, canvas, context );
```

If you refresh the page you will notice that there is now an "Uncaught ReferenceError" error in your browser console, this is because we have not defined `iCanvas`. To do so on the line before `App.run` place the following code:

```javascript
var iCanvas = new ImageCanvas();
```

###Updating the Image Canvas

Now that we have the `ImageCanvas` object initiated and being updated a least every tick, before we can start rendering the pixels to the `<canvas>` context we need to first write the code to identify if the image canvas has focus, what pixel if any that the cursor has been placed over and if the mouse button has been clicked so that we may update the pixels on/off flag.

####Identifing HasFocus:

To begin with we shall first identify if the `ImageCanvas` object has focus. You may have noticed that to do this the `ImageCanvas` is missing three valuable properties, for those of you reading this whom haven't, in order to determine if the mouse `(x,y)` position is within the `ImageCanvas` we need to first know how high and how wide the `ImageCanvas` is. Doing so is a simple case of multiplying the pixel width (`private.pixelW`) by the number of pixels (`private.xPixels`) and the same for the height properties. Finally we need to set a variable for storing the "this has focus" boolean.

Paste the following into the `ImageCanvas` object, before the `return`:

```javascript
private.cWidth   = (private.xPixels * private.pixelW);
private.cHeight  = (private.yPixels * private.pixelH);
private.hasFocus = false;
```

To determine if the cursor is within the area containing the `ImageCanvas` we need to check the following (eventually we will add offsets to these):

* If the `Mouse.x` value is equal-to or greater-than (&ge;) zero[^1]
* If the `Mouse.x` value is less-than or equal-to (&le;) `private.cWidth`
* If the `Mouse.y` value is equal-to or greater-than (&ge;) zero
* If the `Mouse.y` value is less-than or equal-to (&le;) `private.cHeight`

This is done via the following `if` statement, which we shall place within our `ImageCanvas.update` method:

```javascript
if( 
    (Mouse.x > 0 && Mouse.y > 0) &&
    (Mouse.x >= 0 && Mouse.x <= private.cWidth)  &&
    (Mouse.y >= 0 && Mouse.y <= private.cHeight) 
){
    console.log('ImageCanvas has focus!');
    private.hasFocus = true;
}else{
    private.hasFocus = false;
}
```

Upon refreshing `index.html` you will now notice that the message "ImageCanvas has focus!" will be printed to your console any time the `(x,y)` position of the mouse relative to the top left of the `<canvas>` element is within the area earmarked for the `ImageCanvas`. 

>**NOTE**: The additional `(Mouse.x > 0 && Mouse.y > 0)` at the begining of the `if statement` "fixes" the statement evaluating `TRUE` when the mouse is outside the vacinity of the `<canvas>` &ndash; this is known as a "[hammy fix](http://en.wikipedia.org/wiki/Quick-and-dirty)" and is something we will be coming back to later on in the series.

####Identifing which pixel if any that the cursor has been placed over:

Now that we have identified when our `ImageCanvas` has focus we need to also identify which, if any 20x20px "pixel" has the cursor over it. This is done within the `ImageCanvas.update` method by looping over each pixel within its `private.pixels` object and checking if the `(x,y)` co-ordinate stored within the `Mouse` object are within any of their area.

```javascript
if (private.hasFocus === true)
{
    for (var y = 1; y <= private.yPixels; y+= 1)
    {
        for (var x = 1; x <= private.xPixels; x+= 1)
        {
            var currentPixel = private.pixels.getPixel( x,y );

            // Reset mouseover
            currentPixel.mouseOver = false;

            if ( Mouse.x >= currentPixel.x && Mouse.x <= (currentPixel.x + currentPixel.w)){
                if ( Mouse.y >= currentPixel.y && Mouse.y <= (currentPixel.y + currentPixel.h) ){
                    currentPixel.mouseOver = true;

                    console.log('Pixel!');

                    if (Mouse.events.mousedown === true)
                    {
                        currentPixel.on = !currentPixel.on;
                    }
                }
            }

            private.pixels.setPixel( x, y, currentPixel );

        }
    }
}
```

Appending your `ImageCanvas.update` method with the above code and reloading `index.html` in your browser will result in the console filling with "Pixel!" every time you place the mouse over a pixel &ndash; you may now remove the line `console.log('Pixel!');` because that will get annoying fast and in any case we want to see the pixel state graphically, this is something we shall do next.

###Rendering the Image Canvas
Now that we have the `update` method of our `ImageCanvas` object finished (*at least for now*) we can focus on updating the `<canvas>` with a graphical representation of the drawable area.

This will require us writing code that will draw a border around the area earmarked for the pixels, followed by writing code that draws a grid within the bordered area to depict each pixel and then finally writing code that loops over each "pixel" within the `private.pixel` property and outputs it within that grid.

####Drawing the border & grid

There are two methods available to use for drawing a border that will depict the edges of the area claimed by `ImageCanvas`:

* Drawing a big square the width and height of the area being bordered filled with the colour that we want the border to be, followed by drawing a second, white square offset by one pixel on each `(x,y)` co-ordinate with the height and width being two <br> pixels shorter as well
* Drawing four lines, one each for the top, bottom, left and right border

This first of these methods is the simplest as it can be easily done with the following four lines of code:

```javascript
context.fillStyle = '#000000';
context.fillRect(0,0, private.cWidth, private.cHeight);

context.fillStyle = '#FFFFFF';
context.fillRect(1,1, (private.cWidth - 2), (private.cHeight - 2));
```

Pasting the above code into your `ImageCanvas.render` method should result in you seeing something similar to the below image when you refresh `index.html` in your browser. While these four lines of code quickly provide us with the borders that we desire, we shall use the second method to draw the grid lines over the top of this box.

![Pixel Editor](/assets/img/javascript-pixel-paint-4.png "Pixel Editor")

Drawing the border and all the lines for the grid on each render pass is horribly inefficient, so we shall do it just once when the `ImageCanvas` object is initiated and cache the result so that it is only rendered once in total.

To begin we will need another `<canvas>` on which to draw our border, grid and eventually the individual pixels. Rather than cluttering our HTML we shall create this `<canvas>` DOM object via JavaScript. To begin, paste the below two lines after `private.hasFocus = false;` within the `ImageCanvas`

```javascript
private.cCanvas  = $('<canvas/>').attr({ width: private.cWidth, height: private.cHeight });
private.cContext = private.cCanvas.get(0).getContext("2d");
```

On the first line we create a new `<canvas>` DOM element using jQuery and assign it to the `private.cCanvas` property. Then on the second line we assign the canvases 2D context to the `private.cContext` property.

> **NOTE:** Because jQuery exposes the actual DOM element in numeric indexes we have to use `get(0)` before we can `getContext("2d")` from `private.cCanvas` had we used raw JavaScript to assign the `private.cCanvas` property this would not have been necessary[^2].

```javascript
// Border
private.cContext.fillStyle = '#999999';
private.cContext.fillRect(0,0, private.cWidth, private.cHeight);

private.cContext.fillStyle = '#FFFFFF';
private.cContext.fillRect(1,1, (private.cWidth - 2), (private.cHeight - 2));

// Grid
private.cContext.beginPath();
private.cContext.strokeStyle = "#DDDDDD";
private.cContext.lineWidth   = "1";

for (var y = 20; y <= private.cHeight; y += private.pixelH) {
    private.cContext.moveTo(0.5 + y, 1);
    private.cContext.lineTo(0.5 + y, private.cHeight - 1);
}

for (var x = 20; x <= private.cWidth; x += private.pixelW) {
    private.cContext.moveTo(1, 0.5 + x);
    private.cContext.lineTo(private.cWidth - 1, 0.5 + x);
}

private.cContext.stroke();

// Cache
private.cGrid = private.cContext.getImageData(0,0, private.cWidth, private.cHeight);
```

After the line containing `private.cContext` within `ImageCanvas` paste the above code and remove the code you previously pasted into the `ImageCanvas.render` method. The above code includes the code for generating the borders, you may notice that I have subdued the border colour from black to a dark grey, this is entirely an ascetic choice to reduce the contrast of the GUI. 

Following the border code is two `for loops` that generate the grid line, this is initiated using `beginPath()` which let the `private.cContext` know that we are beginning a path made up of sub-paths ( the `moveTo` and `lineTo` bits ), this use of `beginPath()` isn't that important for us as we are only drawing the grid once before caching it, but if we did this every frame then it would eventually cause fps to slow down.

You will notice that the `x` and `y` variables in each for loop, start at 20 rather than at zero. This ensures that it doesn't draw a light grey grid line over the dark grey left and top border line; additionally the line lengths are docked by one pixel right and bottom for the same reason.

```javascript
context.putImageData( private.cGrid, 0, 0 );
```

To see the fruit of our efforts so far, paste the above code into your `ImageCanvas.render` method and refresh `index.html` in your browser and you should see the bellow:

![Pixel Editor](/assets/img/javascript-pixel-paint-5.png "Pixel Editor")

####Drawing the pixels

We now have everything in place to draw the pixels; we shall be doing this directly to the `context` that we have passed to the `ImageCanvas.render` method, because while caching the grid to `private.cGrid` allows us to reuse the `private.cContext` its simpler for our purposes to draw directly to the main `context`.

Drawing of the pixels requires code that is surprisingly simple, it involves two nested `for` loops counting from 1 to 16 (`private.xPixels` & `private.yPixels`) getting the pixel state from `private.pixels` for each pixel `(x,y)` co-ordinate and then first: drawing a black square at the pixels `(x,y)` co-ordinate if the pixel is *"switched on"* and secondly drawing a transparent grey square at the same location if the pixels mouse over state is `true`.

>**NOTE:** Each pixel's width and height (`private.pixelW` & `private.pixelH`) is 20, and the border is (rightly or wrongly) included within that size, so when we draw the square we have to first make sure its `(x,y)` co-ordinates are each offset by `+1` and that the width and height are each reduced by `-1`.

```javascript
for (var y = 1; y <= private.yPixels; y+= 1)
{
    for (var x = 1; x <= private.xPixels; x+= 1)
    {
        var currentPixel = private.pixels.getPixel( x, y );

        if ( currentPixel.on === true)
        {
            context.fillStyle = 'rgba(0,0,0,1)';
            context.fillRect( currentPixel.x + 1, currentPixel.y + 1, private.pixelW - 1, private.pixelH - 1 );
        }

        if ( currentPixel.mouseOver === true)
        {
            context.fillStyle = 'rgba(0,0,0,0.2)';
            context.fillRect( currentPixel.x + 1, currentPixel.y + 1, private.pixelW - 1, private.pixelH - 1 );
        }
    }
}
```

Appending the above to your `ImageCanvas.render` method and refreshing `index.html` in your browser should now mean that when you place the mouse cursor over a "pixel" within the grid that it will turn light grey and clicking that pixel will switch its state between black (`on`) and white ('off') &ndash; much like the image below.

![Pixel Editor](/assets/img/javascript-pixel-paint-6.png "Pixel Editor")

###Bugs!
You may or may not have noticed three potential bugs in the code above, these are the ones I know about[^3] and were intentionally written in for the purpose of this section. Before continuing you may like to take some time looking for possible bugs yourself and attempt to fix them.

The first bug is that when you click a pixel, quite often it will be set and then unset again, this is because the update method gets called around six times per frame working out to be three hundred and sixty times a second if your system hits the targeted 60fps. This means that the update method will be fired more than once during the time it takes you to click, firstly switching the pixel on and secondly switching it off.

To fix this bug I opt to set the pixel to `on` when the user clicks the left mouse button and set the pixel to `off` when any other mouse button is pressed. We already store the mouse button that is pressed in `Mouse.events.mouseButton` so all that is left to do is replace the line `currentPixel.on = !currentPixel.on;` with the below code:

```javascript
currentPixel.on = ( Mouse.events.mouseButton === 1) ? true : false;
```

The above will switch off a pixel when any mouse button other than the left mouse button is clicked, for my three button mouse that means the middle and right mouse buttons will switch off a pixel. This bug-fix gives us two rudimentary tools a pen and a eraser.

The second bug is slightly more complex in that when the mouse cursor is placed on the border between pixels then the adjoining pixel is selected as well. This means that when clicking the middle of two intersecting lines we can inadvertently switch on up to four pixels at once.

The cause of this bug is the code within the `Pixels.reset` method that we use to initiate the `Pixels.pixel` property. The problematic code in question is below:

```javascript
{
    mouseOver: false,
    on: false,
    x: ((x - 1) * private.pixelW),
    y: ((y - 1) * private.pixelH),
    h: private.pixelH,
    w: private.pixelW
}
```

As you can see we are setting each pixels `x` co-ordinate to being `((x - 1) * private.pixelW)` and each `y` co-ordinate to being `((y - 1) * private.pixelH)` to the casual observer you might think that the `(x - 1)` would be the problem but it's not, the reason for the subtraction is because the `for` loops begin at 1 rather than 0. The actual bug is in using `private.pixelH` and `private.pixelW` without taking into consideration the 1 pixel border that surrounds each pixel on screen.

```javascript
{
    mouseOver: false,
    on: false,
    x: ((x - 1) * private.pixelW),
    y: ((y - 1) * private.pixelH),
    h: (private.pixelH - 1),
    w: (private.pixelW - 1)
}
```

The third bug is repeatable by clicking on the drawable area and dragging the mouse first outside the `<canvas>` element and then back into it. When `<canavs>` loses mouse focus we reset the mouse button value within our `Mouse` object and thus the cursor starts erasing pixels rather than drawing them.

The reason for this particular bug is because we haven't correctly reset the `Mouse` object when our `<canvas>` element loses mouse focus. To do this add the following code to the `$('#paintMe').on('mouseout', ...` event function.

```javascript
Mouse.events.mousedown   = false;
```

Having looked over the projects code again, there is a fourth bug; however as it doesn't stop the pixel editor from working I shall leave it for now and return to it at the end of this series when we will be tidying everything up and adding some more browser support.

###`(x,y)` offset
Fixing the code with the above and refreshing `index.html` will now reveal a working drawing pane. Before I wrap up part two of this tutorial series you may be wondering why we have created a drawing area that is smaller than the HTML `<canavas>` that we are drawing it on to. In later parts we will be filling the additional space with other GUI elements notably a preview and a palette, each element will be positioned relative to the top left of the HTML `<canvas>`

```javascript
private.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 10, y: 10 };
```

Adding an offset to `ImageCanvas` only requires modifying a few lines of code and begins by inserting the above to `ImageCanvas`  on a line above its `return` (anywhere amongst the other `private` properties is fine.)

Then within the `ImageCanavs.render` method amend the line beginning with `context.putImageData` with the below:

```javascript
context.putImageData( private.cGrid, private.offset.x, private.offset.y );
```

Then within the same method replace both lines beginning with `context.fillRect` with the below:

```javascript
context.fillRect( (private.offset.x + currentPixel.x + 1), (private.offset.y + currentPixel.y + 1), (private.pixelW - 1), (private.pixelH - 1) );
```

Finally now that we have made the `render` method aware of its offsets, we update the `update` method so that the pixels mouse event handler looks like the below[^4]:

```javascript
if ( Mouse.x >= (private.offset.x + currentPixel.x) && Mouse.x <= (private.offset.x + currentPixel.x + currentPixel.w)){
    if ( Mouse.y >= (private.offset.y + currentPixel.y) && Mouse.y <= (private.offset.y + currentPixel.y + currentPixel.h) ){
        currentPixel.mouseOver = true;
        if (Mouse.events.mousedown === true)
        {
            currentPixel.on = ( Mouse.events.mouseButton === 1);
        }
    }
}
```

Doing so should result in you seeing similar[^5] to the below when refreshing `index.html` in your browser and nicely brings us to the end of the second part of this five part tutorial.

![Pixel Editor](/assets/img/javascript-pixel-paint-7.png "Pixel Editor")

Thank you for reading, next in [part three](/blog/2015/02/04/writing-a-pixel-editor-in-javascript-p3/) we add a live preview to our interface and tidy some of the code up.

[^1]: I chose to introduce focus detection without mentioning `(x,y)` offsets as they are discussed later on in this tutorial.
[^2]: This is something we will re-visit towards the end of the series when we tidy things up.
[^3]: Please drop me a comment or fork the project on github if you can see any bugs I don't know about.
[^4]: Looking back on this, I now notice that I had sneaked in a quick amend to the `currentPixel.on` logic making it a little simpler.
[^5]: And with better drawing skills, a nicer image.
