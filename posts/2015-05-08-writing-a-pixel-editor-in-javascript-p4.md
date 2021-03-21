---

title: Writing a pixel editor in javascript - Part four
categories:
    - tutorials
tags:
    - programming
    - javascript
cover_image: /assets/img/javascript-pixel-paint-11.png
---

![Pixel Editor](/assets/img/javascript-pixel-paint-9.png "Pixel Editor")

In [part three](/blog/2015/02/04/writing-a-pixel-editor-in-javascript-p3/) we finished adding a preview to our pixel editor. In this, the fourth part, we shall be adding the palette selector. As always, you can grab all the files from this tutorial series [here at github](https://github.com/photogabble/pixel-editor-tutorial).

**Contents**

* [Stage one: Setting up the application loop and listening to mouse input](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/)
* [Stage two: 1-bit drawing to a 16x16 pixel canvas](/blog/tutorials/writing-a-pixel-editor-in-javascript-p2/)
* [Stage three: Adding a preview](/blog/tutorials/writing-a-pixel-editor-in-javascript-p3/)
* [Stage four: Adding a palette selector](/blog/tutorials/writing-a-pixel-editor-in-javascript-p4/)
* [Stage five: Saving of images](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/)
* [Stage six: Webpack, Linting and ES6](/blog/tutorials/writing-a-pixel-editor-in-javascript-p6/)
* Stage seven: Adding a paint bucket tool and undo history
* Stage eight: Writing a PHP backend to create a public library of images

Unlike the preview that we added in part three, the palette selector is quite complex and a lot of the code is within only a handful of methods. Because of this I am breaking down a lot of the code line by line, however if you feel I have missed any detail or are confused by why something was done in a certain way, please feel free to leave a comment or [tweet me](https://twitter.com/carbontwelve).

Below is our Palette object outline, to begin paste this into your `app.js` file:

```javascript
var Palette = function( options ){
    var private      = {};
    private.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 341, y: 63 };
    private.loaded   = false;
    private.cCanvas  = $('<canvas/>').attr({ width: 43, height: 222 });
    private.cContext = private.cCanvas.get(0).getContext("2d");
    private.cCache   = null;

    private.palette   = [
        '#000000',
        '#FFFFFF',
        '#9D9D9D',
        '#BE2633',
        '#E06F8B',
        '#493C2B',
        '#A46422',
        '#EB8931',
        '#F7E26B',
        '#2F484E',
        '#44891A',
        '#A3CE27',
        '#1B2632',
        '#005784',
        '#31A2F2',
        '#B2DCEF'
    ];

    private.currentColour = '#000000';
    private.hasFocus  = false;
    private.paletteMousePositions = [];

    return {

        update: function( step, canvas, context)
        {

        },
        render: function( step, canvas, context)
        {

        }
    }
};
```

Getting set up is similar to when we added the preview, you initiate the Palette object as `iPalette` by adding `var iPalette = new Palette();` on the line below where we defined `iPreview`. Finally add `iPalette.update( step, canvas, context);` to the `update` method of our App and `iPalette.render( step, canvas, context);` to its render method, ideally on the line below their `iPreview` counterparts.

As with the `Preview` object, you can see that our `Palette` object has a handful of private properties: the `offset`, `loaded`, `cCanvas`, `cContext`, and `cCache` private methods should be quite familiar as they have the same purpose as in other objects, following these is the `palette` property an array containing sixteen colours. For those of you who are interested I obtained the palette from [here](http://androidarts.com/palette/16pal.htm) where you may also find a little history of its creation.

Following the `palette` is `currentColour` a variable that simply stores the current colour; I have chosen to have this reference the hex value of the colour rather than its position within the `palette` array because then it doesn't absolutely limit you to the palette and you can add a colour picker later on if you want to.

The `hasFocus` property should be pretty self-documenting so I shall skip to the final private property `paletteMousePositions`. The `paletteMousePositions` property is an array that we will fill with the mouse positions of each palette square so that we may know when each palette square once rendered on the screen has mouse focus. Calculating these positions is only required once and so we can add the following private method and its initiator to our `Preview` object on the line before its `return` operator:

```javascript
    private.setUpMousePositions = function()
    {
        private.paletteMousePositions = [];
        var x  = 1;
        var y  = 1;

        for ( var i = 0; i<= private.palette.length - 1; i += 1)
        {
            var temp = {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                color: private.palette[i]
            };

            temp.x1 = x;
            temp.y1 = y;
            temp.x2 = temp.x1 + 20;
            temp.y2 = temp.y1 + 20;

            x += 21;

            if ( i % 2 == 1){ y+= 21; x = 1; }

            private.paletteMousePositions[i] = temp;
        }

        private.loaded = true;
    };

    private.setUpMousePositions();
```

Once the above private method is called, it loops over each element in the private[^1] `palette` array creating a temporary object to contain that palette elements `x1`, `x2`, `y1`, `y2` and `color` properties which it then adds to the private `paletteMousePositions` property. Each palette colour box will be 20 pixels square, you will notice that both `x` and `y` are initially offset by 1 and are incremented by 21 during the loop. This is to give a 1 pixel *gutter* surrounding each box which will act as a border when they are drawn over a black rectangle.

Within the `Palette` objects public `render` method we can use the private `paletteMousePositions` property to render out the palette to our canvas and identify within the `update` method if the mouse cursor is within one of the rendered palette boxes and if the user is selecting (via clicking) a new colour. I will first discuss the `render` method and how it works so that you can see the palette before we continue with cursor interaction.

Paste the following code into your `Palette` objects `render` method:

```javascript
    // Sometimes this method is called by the main loop before the objects
    // constructor has time to initialise, the following line stops
    // that from happening.
    if ( private.loaded === false ){ return; }

    // Clear the Palette context, ready for a re-draw
    private.cContext.clearRect( 0 , 0 , 42, 170 );

    // Draw a border and background
    private.cContext.fillStyle = "#000000";
    private.cContext.fillRect( 0, 0, 43, 169);
    private.cContext.fillStyle = "#000000";
    private.cContext.fillRect( 0, 179, 43, 43);

    // Draw each coloured box for the pallet
    var x = 1;
    var y = 1;

    for ( var i = 0; i<= private.palette.length - 1; i += 1)
    {
        private.cContext.fillStyle = private.palette[i];
        private.cContext.fillRect( x, y, 20, 20);

        x += 21;

        if ( i % 2 == 1){ y+= 21; x = 1; }
    }

    // Draw the current colour
    private.cContext.fillStyle = private.currentColour;
    private.cContext.fillRect( 1, 180, 41, 41);

    // Get the image data from the palette context and apply
    // it to the main canvas context passed through by the
    // main loop
    context.putImageData( private.cContext.getImageData(0,0, 43, 222), private.offset.x, private.offset.y );
```

I have added as many informative comments as I feel are necessary to the above code. We could use the `private.paletteMousePositions.length` property instead of the `private.palette.length` that has ultimately made it into this version; and this is likely something that I will focus on in the last chapter of this series[^2] - with the above pasted into your `Palette` objects public `render` method, refreshing `index.html` in your browser should result in you seeing the below[^3]:

![Pixel Editor](/assets/img/javascript-pixel-paint-10.png "Pixel Editor")

Currently clicking on the pallet will achieve nothing because the `update` method is not keeping track of user input; to make it do so, paste the following commented code into your `Palette` objects `update` method:

```javascript
    // Sometimes this method is called by the main loop before the objects
    // constructor has time to initialise, the following line stops
    // that from happening.
    if ( private.loaded === false ){ return; }

    // Check to see if the Pallet object has focus, and resetting the mouse
    // cursor if not.
    if (
        Mouse.x >= private.offset.x &&
        Mouse.x <= ( private.offset.x + 43 ) &&
        Mouse.y >= private.offset.y &&
        Mouse.y <= ( private.offset.y + 222 )
    ){
        private.hasFocus = true;
    }else{
        private.hasFocus = false;
        canvas.css('cursor', 'auto');
    }

    if (private.hasFocus === true)
    {
        // Check to see if the mouse cursor is within the pallet picker
        // area, and over a selectable colour then change the cursor to
        // let the user know that they can interact
        if(
            Mouse.x >= (private.offset.x + 1) &&
            Mouse.x <= (private.offset.x + 43 ) &&
            Mouse.y >= (private.offset.y + 1) &&
            Mouse.y <= (private.offset.y + 168 )
        ){
            canvas.css('cursor', 'pointer');

            // If the mouse is clicked then the current palette colour
            // to the hex value of the selected item
            if ( Mouse.events.mousedown === true) {
                for (var i = 0; i <= private.paletteMousePositions.length - 1; i += 1) {
                    if (
                        Mouse.x >= ( private.offset.x + private.paletteMousePositions[i].x1 ) &&
                        Mouse.x <= ( private.offset.x + private.paletteMousePositions[i].x2 ) &&
                        Mouse.y >= ( private.offset.y + private.paletteMousePositions[i].y1 ) &&
                        Mouse.y <= ( private.offset.y + private.paletteMousePositions[i].y2 )
                    ){
                        if (private.currentColour !== private.paletteMousePositions[i].color)
                        {
                            private.currentColour = private.paletteMousePositions[i].color;
                        }
                    }
                }
            }

        }else{
            canvas.css('cursor', 'auto');
        }
    }
```

Upon pasting the above and refreshing `index.html` you will notice that now when you click on a pallet item the current colour box changes to show the current colour as being that pallet item. However upon selecting your colour from the pallet you will notice that the drawing colour is not updated. To do this we need to add a new public method to our `Pallete` class called `getCurrentColour` the code for which is below[^4]:

```javascript
    getCurrentColour: function(){
        return private.currentColour;
    }
```

To use the current selected colour now publicly available through this new getter we now need to update the `Pixels`, `Preview`, and `ImageCanvas`  objects; to begin with we shall update the `Pixels` object and modify it to store pixel colour information. To do this all we need to do is add `colour: '#000000'` to the object we use within the `reset` method so that it looks like the below:

```javascript
    // ...
    this.setPixel(
        x, y, {
            mouseOver: false,
            colour: '#000000', // New Colour attribute
            on: false,
            x: ((x - 1) * private.pixelW),
            y: ((y - 1) * private.pixelH),
            h: (private.pixelH - 1),
            w: (private.pixelW - 1)
        }
    );
    // ...

```

Now that the `Pixels` object is capable of storing pixel colour data we can use that within the `Preview` and `ImageCanvas` objects to draw each pixel. Within the `Pixels` object this is done via amending the public `update` method to use the `currentPixe.colour` rather than `'#000000'` as the fill style before drawing the pixel. Once done your `update` method should look the like the below:

```javascript
    // ...
    if ( currentPixel.on === true )
    {
        // Now using the current pixels colour attribute
        private.cContext.fillStyle = currentPixel.colour;
        private.cContext.fillRect( (14 + x - 1) ,( 16 + y - 1), 1, 1);
    }
    // ...
```

The `ImageCanvas` object requires two amends, one within its `update` method to set the pixels colour to the currently selected colour followed by one amend to its `render` method in the same way we updated `Preview` object to use the pixels colour when displaying it. To begin with we shall amend its `update` method:

```javascript
// ...
    if (Mouse.events.mousedown === true)
    {
        // If the left mouse button is pressed then switch the
        // pixel on and set its colour. Otherwise switch the pixel
        // off and reset its colour.
        if (Mouse.events.mouseButton === 1){
            currentPixel.on = true;
            currentPixel.colour = iPalette.getCurrentColour();
        }else{
            currentPixel.on = false;
            currentPixel.colour = '#FFFFFF';
        }
    }
// ...
```

Once the above is complete and upon refreshing `index.html` you will notice that the main drawing canvas still displays a 1-bit depth representation of the pixel data while the updated `Preview` now displays it in colour - this is no surprise as we have yet to update the `ImageCanvas` objects `render` method, but it does show a good example of the separation of concerns within our projects UI. To complete the task and finish the amends to `ImageCanvas` all that needs to be done is to amend the objects `render` method to use the pixels colour data rather than `'#000000'`, this is done by amending the following code:

```javascript
    // ...
    if ( currentPixel.on === true)
    {
        // Use the currentPixel.colour to display the pixel
        context.fillStyle = currentPixel.colour;
        context.fillRect(
            (private.offset.x + currentPixel.x + 1),
            (private.offset.y + currentPixel.y + 1),
            (private.pixelW - 1),
            (private.pixelH - 1)
        );
    }
    // ...
```
Having inserted the above amend refreshing your `index.html` should now result in you being able to select the current colour from the pallet and draw with that colour on the drawing canvas area. With the preview displaying a true 16x16 pixel representation of your image.

![Pixel Editor](/assets/img/javascript-pixel-paint-11.png "Pixel Editor")

Thank you for reading, next in [part five](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/) we shall build in saving images that are created and finally making the JavaScript strict mode compliant before packaging it up as a self contained library dependant only on jQuery. If you have any comments, questions or suggestions please leave them below in the comment form, or drop me a tweet [@carbontwelve](https://twitter.com/carbontwelve).

[^1]: Because it is a private method it has the privilege to be able to view private properties
[^2]: Using the `private.paletteMousePositions` property here would allow you to dynamically update the `private.palette` through some public setter method allowing for pallets to be saved and loaded, however that is beyond the scope of this tutorial (feel free to attempt it yourself as an extra exercise)
[^3]: Feel free to swap out the palette for your own and see the rendered pallet change when you hit refresh
[^4]: Don't forget the comma between the last method and this new one when adding it to the public object
