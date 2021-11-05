---
title: Writing a pixel editor in javascript - Part one
categories: [tutorials]
tags: [programming, javascript]
cover_image: /img/javascript-pixel-paint-3.png
featured: false
---

![Pixel Editor](/img/javascript-pixel-paint-2.png "Pixel Editor")
[![Pixel Editor](/img/github.png "Github")](https://github.com/photogabble/pixel-editor-tutorial)

Recently during a conversation with a colleague I was reminded about a small side project that I once maintained called "pixels." It was essentially a 1-bit pallete 16x16 on-line image creator where you could create a tiny image and post it to a gallery. I had written it a number of years ago at a time when I decided that I would start learning JavaScript.

Reminiscing about this project with some nostalgia I decided that with the new PhotoGabble I should revisit my pixels project and bring it back to life and in doing so I would write a tutorial on writing a basic image editor in JavaScript.

Due to the amount of detail that I have gone into, the tutorial is quite lengthy and as such I have broken it down into several bite-sized stages. The source code for the entire project from all stages is available [here on github](https://github.com/photogabble/pixel-editor-tutorial). If you find any errors or have suggestions on how to improve the code, it would be amazing if you would [raise an issue](https://github.com/photogabble/pixel-editor-tutorial/issues) on github or [fork the project and create a pull request](https://github.com/photogabble/pixel-editor-tutorial/pulls).

**Contents**

* [Stage one: Setting up the application loop and listening to mouse input](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/)
* [Stage two: 1-bit drawing to a 16x16 pixel canvas](/blog/tutorials/writing-a-pixel-editor-in-javascript-p2/)
* [Stage three: Adding a preview](/blog/tutorials/writing-a-pixel-editor-in-javascript-p3/)
* [Stage four: Adding a palette selector](/blog/tutorials/writing-a-pixel-editor-in-javascript-p4/)
* [Stage five: Saving of images](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/)
* [Stage six: Webpack, Linting and ES6](/blog/tutorials/writing-a-pixel-editor-in-javascript-p6/)
* Stage seven: Adding a paint bucket tool and undo history
* Stage eight: Writing a PHP backend to create a public library of images

###To begin
To begin with you need to create two blank files in your IDE/text editor of choice: `index.html` and `app.js`. The code below is for the `index.html`, it is quite simple and will not change at all throughout the rest of this tutorial simply copy and paste it into your `index.html` file.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pixel Editor</title>
  <meta name="description" content="Pixel Image Editor Example">
  <meta name="author" content="Simon Dann">
  <style>
    html{
      background: #ccc;
    }
    #canvasContainer{
      width: 394px;
      height: 375px;
      margin: 100px auto;
    }
    canvas{
      background: #fff;
    }
  </style>
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>
<body>
    <div id="canvasContainer">
        <canvas id="paintMe" width="394" height="375">
            Canvas tag not supported
        </canvas>
    </div>
    <script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
```
You will notice that I have included the 1.11.2 version of jQuery into the project. We shall be using jQuery as a short cut for initially selecting the `<canvas>` element[^1] and for initially capturing mouse events.

###The basic application loop
In one of the first versions of the image editor code I had all the update and render code execute every time a mouse event was fired on the canvas element; this lead to an incredibly slow response time and excessive use of the host computers processor. To aleviate this I utilise the following game loop that uses requestAnimationFrame and attempts to keep the refresh rate of the canvas to 60fps.

```javascript
var App = {
    timestamp: function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    },

    run: function(options)
    {
        var now,
        dt       = 0,
        last     = App.timestamp(),
        slow     = options.slow || 1, // slow motion scaling factor
        step     = 1/options.fps,
        slowStep = slow * step,
        update   = options.update,
        render   = options.render,
        canvas   = options.canvas,
        context  = options.canvas.get(0).getContext("2d");

        function frame() {
            now = App.timestamp();
            dt = dt + Math.min(1, (now - last) / 1000);
            while(dt > slowStep) {
                dt = dt - slowStep;
                update(step, canvas, context);
            }
            render(dt/slow, canvas, context);
            last = now;
            requestAnimationFrame(frame, canvas);
        }
        requestAnimationFrame(frame);
    }
};

App.run({
    canvas: $('#paintMe'),
    fps: 60,
    update: function(step, canvas, context){
        ...
    },
    render: function(step, canvas, context){
        ...
    }
});
```

Within the above example, the `App.run` method attempts to execute the `update` method as many times per frame step as it can so long as there is time to execute `render` once per step. The use of `requestAnimationFrame` is purely because it is available in all modern desktop browsers, you could for example alternatively use `setTimeout` to achieve the same non-io-blocking loop.

Within the update method we will check the current mouse position, update mouse event flags based upon current mouse events and execute other application objects update methods. The finished application has four updatable objects: `Toolbox`, `Pallete`, `Preview` and `Grid`.

Within the render method we will clear the current `context` and then execute other application objects render methods. The finished application has six renderable objects: `Toolbox`, `Pallete`, `Preview`, `Grid`, `Canvas` and `Debug` that make up the applications GUI.

As each of the mentioned objects are added to the application we will investigate each individually, but for now I shall discuss how the user input is handled.

###Mouse input
To store the current mouse input metadata we create a Mouse object for the purpose of storing the current `(x,y)` position of the cursor and the `mouseover`, `mouseout`, `mousedown` and `mousemove` events. You may have noticed within the above example that I use jQuery to discover and pass the canvas DOM object to the `App` object. I like to use jQuery in this way as a nice shortcut library therefore we will use it here to capture mouse events on our canvas DOM object and update the relevant properties of the `Mouse` object as shown below.

```javascript
var Mouse = {
    x: 0,
    y: 0,
    events: {
        mouseover: false,
        mouseout: false,
        mousedown: false,
        mousemove: false,
        mouseButton: 0
    },
    previousEvents: {
        mouseover: false,
        mouseout: false,
        mousedown: false,
        mousemove: false,
        mouseButton: 0
    }
};

$('#paintMe').on('mouseover', function(e){
    Mouse.events.mouseover   = true;
    Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
    Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
});

$('#paintMe').on('mouseout', function(e)
{
    Mouse.events.mousemove   = false;
    Mouse.events.mouseover   = false;
    Mouse.events.mouseout    = true;
    Mouse.events.mouseButton = 0;

    Mouse.x                  = 0;
    Mouse.y                  = 0;
});

$('#paintMe').on('mousemove', function(e)
{
    Mouse.events.mousemove   = true;
    Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
    Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
    return false;
});

$('#paintMe').on('mousedown', function(e)
{
    Mouse.events.mousedown   = true;
    Mouse.events.mouseup     = false;
    Mouse.events.mouseButton = e.which;
    return false;
});

$('#paintMe').on('mouseup', function(e)
{
    Mouse.events.mousedown   = false;
    Mouse.events.mouseup     = true;
    Mouse.events.mouseButton = 0;
    return false;
});

// This returns false to disable the operating systems context menu on right click
$('#paintMe').contextmenu(function() {
    return false;
});
```

You will notice that we now have the `Mouse` object being updated each time there is a mouse event on our `<canvas>` element, but that the `Mouse.previousEvents` property remains untouched.

The `Mouse.previousEvents` property is a cache of what the `Mouse.events` had been during the previous update tick. Doing this allows us to check to see what the cursor is clicking on. Paste the below code into your update method and then refresh `index.html` within your browser. Upon the mouse event changing you will see your console fill up with messages.

```javascript
if ( Mouse.previousEvents.mouseover !== Mouse.events.mouseover )
{
    Mouse.previousEvents.mouseover = Mouse.events.mouseover;
    console.log('Mouse Over Event Changed');
}

if ( Mouse.previousEvents.mousemove !== Mouse.events.mousemove )
{
    Mouse.previousEvents.mousemove = Mouse.events.mousemove;
    console.log('Mouse Move Event Changed');
}

if ( Mouse.previousEvents.mouseup !== Mouse.events.mouseup )
{
    Mouse.previousEvents.mouseup = Mouse.events.mouseup;
    console.log('Mouse Up Event Changed');
}

if ( Mouse.previousEvents.mousedown !== Mouse.events.mousedown )
{
    Mouse.previousEvents.mousedown = Mouse.events.mousedown;
    console.log('Mouse Down Event Changed');
}

if ( Mouse.previousEvents.mouseButton !== Mouse.events.mouseButton )
{
    Mouse.previousEvents.mouseButton = Mouse.events.mouseButton;
    console.log('Mouse Button Event Changed');
}
```

![Pixel Editor Stage 1 Conclusion](/img/pixel-paint-stage-1-conclusion.png "Pixel Editor Stage 1 Conclusion")

If all went well then your console should fill up with messages similar to those depicted above &ndash; if so, congratulations you have now laid the ground work for out pixel editor.

[Click here to continue to the next stage of the tutorial](/blog/2015/01/28/writing-a-pixel-editor-in-javascript-p2/) where we shall use the mouse input to draw on a 16x16 grid of pixels.

[^1]: The use of jQuery is purely as a short cut because it includes a lot of multi-browser support out of the box.
