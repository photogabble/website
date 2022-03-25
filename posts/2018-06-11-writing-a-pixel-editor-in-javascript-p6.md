---
title: Writing a pixel editor in javascript - Part six
categories:
    - tutorials
tags:
    - programming
    - javascript
cover_image: /img/javascript-pixel-paint-12.png
draft: false
growthStage: budding
---

![Pixel Editor](/img/javascript-pixel-paint-12.png "Pixel Editor")

This part comes three years after the first couple of parts were written and in that time ES6 has become regularly used and tools such as webpack have become synonymous with front end development.

In [part five](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/) we tidied up the JavaScript and added the ability to save the image to the users computer as a png. In this, the sixth part, we shall be introducing the webpack module builder to our project and with it ES6, linting and the Babel compiler.

**Contents**

* [Stage one: Setting up the application loop and listening to mouse input](/blog/tutorials/writing-a-pixel-editor-in-javascript-p1/)
* [Stage two: 1-bit drawing to a 16x16 pixel canvas](/blog/tutorials/writing-a-pixel-editor-in-javascript-p2/)
* [Stage three: Adding a preview](/blog/tutorials/writing-a-pixel-editor-in-javascript-p3/)
* [Stage four: Adding a palette selector](/blog/tutorials/writing-a-pixel-editor-in-javascript-p4/)
* [Stage five: Saving of images](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/)
* [Stage six: Webpack, Linting and ES6](/blog/tutorials/writing-a-pixel-editor-in-javascript-p6/)
* Stage seven: Adding a paint bucket tool and undo history
* Stage eight: Writing a PHP backend to create a public library of images

## Why use a build system?

During the building of our pixel editor we have "managed" our simple JavaScript dependencies by including all of our js files in `index.html` in the order in which they are needed. 

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="app.js"></script>
```

Now that the project has grown quite large we have multiple objects all residing within our `app.js` it would be a good idea to split them out into one js file for each object. If we were continuing to develop with ES5 in strict mode this would result in our `index.html` looking something like this:

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="app.pixels.js"></script>
<script src="app.preview.js"></script>
<script src="app.imagecanvas.js"></script>
<script src="app.palette.js"></script>
<script src="app.js"></script>
<script src="app.js"></script>
```

Even when this tutorial series was first written three years ago the above was considered bad practice due to the excess HTTP requests. So you would instead use a task runner like [grunt](https://gruntjs.com/) or [gulp](https://gulpjs.com/) to concatenate and minify all your dependencies into one `app.min.js` file and include that on your page instead.

In this part we are going to begin splitting the app out into individual files and in doing so rewrite the project using ES6 syntax. While all of this could be achieved with the aforementioned task runners being used to build our `app.min.js` file I have settled on using [Webpack](https://webpack.js.org/). While using Webpack for a small project like this one is a little overkill the gulp and grunt plugins I would have used for building the Javascript appear to no [longer be maintained](https://www.npmjs.com/package/gulp-browserify).

## Setting up Webpack

To begin with we need to create the following `package.json` file within our project root:

```json
{
  "name": "pixel-editor-tutorial-part-six",
  "version": "1.0.0",
  "description": "Part six of the Pixel Editor tutorial on photogabble.co.uk",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Simon Dann <simon.dann@gmail.com>",
  "license": "MIT"
}
```

Next you will need to run the following command to install webpack and its cli tool with npm:

```bash
npm install webpack webpack-cli --save-dev
```

As of writing this, the aforementioned will install Webpack version 4.11.1. If you're new to npm what the above command does is inform npm to install into a folder called `node_modules` within your project root, Webpack and all of the packages it depends on (at current count 319.) The `--save-dev` flag instructs npm to update our newly created `package.json` with the dependency. 

Once the install is completed you will have a new `node_modules` folder in your project root as well as a `package-lock.json` file. You can go ahead and add the `package-lock.json` file to your repository however you will notice that git (or your repository software of choice) will now be notifying you of roughly 3000 new files to add.[^1] In order to tell git to ignore the folder create a `.gitignore` file in the project root with the following content (the main.js bit will make sense once you read on.):

```
node_modules
dist/main.js
```

Next in order to work with how Webpack expects the project to be laid out we need to tweek our directory structure. First rename your `app.js` to `index.js` and move it into a new folder called `src`. Then move `index.html` into a new folder called `dist`. Once done you should have the following directory structure:

```treeview
pixel-editor-project/
├── .gitignore
├── package.json
├── dist/
|   └── index.html
└── src
    └── app.js
```

If you have version 8.2 of Node or higher you will have the `npx` command installed. Webpack 4 is pretty much zero config out of the box with sane defaults so unsurprisingly running it with `npx` results in a working build:

```bash
$> npx webpack

Hash: fe6ab8b22bae39805486
Version: webpack 4.11.1
Time: 123ms
Built at: 2018-06-06 23:41:02
  Asset      Size  Chunks             Chunk Names
main.js  8.91 KiB       0  [emitted]  main
[0] ./src/index.js 24.3 KiB {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
```

You should now see a compiled `main.js` sitting in your `dist` folder. In order for `index.html` to work you simply need to modify the line importing the `app.js` script to importing `main.js` and everything will be working as it was before. As for the warning, it's because we didn't tell Webpack which [mode](https://webpack.js.org/concepts/mode/) to be in so it assumes we want it to compile as though it's going to a production environment.

One way of making the warning go away is to run Webpack with the _mode_ argument defined, for example `npx webpack --mode=production`. However as we are going to be using Babel to transpile our ES6 into browser compatible ES5 code we shall instead create a `webpack.config.js` file and set the _mode_ there based upon environment.

```javascript
module.exports = function (env, argv) {
    let config = {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-maps' : 'eval',
    };

    return config;
};
```

Running webpack now will result in it warning that `env` isn't defined, this is done via the _env_ argument for example `npx webpack --env.production` would set it to true. To give ourselves a little shortcut replace the `scripts:{...}` section within your `package.json` with the following:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "webpack --env.development",
  "production": "webpack --env.production"
},
```

Next we need to install Babel and its Webpack loader using npm:

```bash
npm install babel-core babel-loader babel-preset-env --save-dev
```

Once installed we need to make two changes to our project in order to get Babel working correctly, the first is to create a `.babelrc` file in the project root with the following content:

```json
{
    "presets": [
        "env"
    ]
}
```

Then we need to modify our `webpack.config.js` file to configure Webpack to use the new loader:

```javascript
module.exports = function (env, argv) {
    let config = {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-maps' : 'eval',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"

                },
            ]
        }
    };
    
    return config;
};
```

## Linting errors

The first four parts of this tutorial series were written three years ago in ES5 JavaScript. This means that there are likely a number of issues with the code that can easily be picked up by a tool called a linter. So that we can see a list of what could be wrong we shall install the [eslint loader](https://github.com/webpack-contrib/eslint-loader) for Webpack as well as [eslint](https://eslint.org):

```bash
npm install eslint-loader eslint babel-eslint --save-dev
```

In order to tell Webpack to run eslint we need to modify our `webpack.config.js` file by adding the below just before the line `return config;`.

```js
if (!env.production) {
    config.module.rules.push({
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
    });
}
```

Upon doing so and running `npm run dev` we are now presented with a failed build and the following error:

```bash
$> npm run dev

Hash: 5003c0992b488cf06840
Version: webpack 4.11.1
Time: 242ms
Built at: 2018-06-07 00:25:38
  Asset      Size  Chunks             Chunk Names
main.js  5.09 KiB    main  [emitted]  main
[./src/index.js] 1.17 KiB {main} [built] [failed] [1 error]

ERROR in ./src/index.js
Module build failed: Error: No ESLint configuration found.
```

This is because we haven't yet created a config file for eslint to use. To do so create `.eslintrc.json` with the following content:

```json
{
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "env": {
    "browser": true
  }
}
```

To keep things simple I have chosen to go with the recommended ruleset that come shipped with eslint, there are however a number of popular options available if you take the time to research them. Also because we are going to be writing ES6 JavaScript we needed to tell eslint to use the babel-eslint parser so that it works.

Now upon running `npm run dev` the build will complete with 1 error[^2] followed by a nice list of linter errors as shown below. Fortunately all of the ones returned for this project are benign and are either artifacts of me leaving function arguments in for clarity or because `requestAnimationFrame` and `console` don't exist outside of a browser environment. 

The below output was grabbed before adding `"env": { "browser": true }` to the `.eslintrc.json` config. You will notice that the errors relating to `requestAnimationFrame` and `console` will not appear in your output because the configuration it telling eslint to test against what should be available in the browser.

```bash
$> npm run dev

Hash: 6d629b5c3fe7dcb1ace7
Version: webpack 4.11.1
Time: 501ms
Built at: 2018-06-07 00:44:26
  Asset      Size  Chunks             Chunk Names
main.js  29.4 KiB    main  [emitted]  main
[./src/index.js] 24.3 KiB {main} [built] [1 error]

ERROR in ./src/index.js

H:\pixel-editor\src\index.js
   74:45  error  'context' is defined but never used     no-unused-vars
  174:30  error  'pixels' is defined but never used      no-unused-vars
  184:46  error  'context' is defined but never used     no-unused-vars
  191:21  error  Unexpected console statement            no-console
  191:21  error  'console' is not defined                no-undef
  336:45  error  'context' is defined but never used     no-unused-vars
  488:17  error  'requestAnimationFrame' is not defined  no-undef
  490:13  error  'requestAnimationFrame' is not defined  no-undef
  507:44  error  'e' is defined but never used           no-unused-vars
  535:43  error  'e' is defined but never used           no-unused-vars
  582:21  error  'console' is not defined                no-undef
  582:21  error  Unexpected console statement            no-console
  588:21  error  'console' is not defined                no-undef
  588:21  error  Unexpected console statement            no-console
  594:21  error  'console' is not defined                no-undef
  594:21  error  Unexpected console statement            no-console
  600:21  error  Unexpected console statement            no-console
  600:21  error  'console' is not defined                no-undef
  606:21  error  Unexpected console statement            no-console
  606:21  error  'console' is not defined                no-undef
  624:3   error  'window' is not defined                 no-undef
  624:18  error  'window' is not defined                 no-undef
  624:26  error  'document' is not defined               no-undef

✖ 23 problems (23 errors, 0 warnings)
```

Note that while Webpack will exit with an error code, it will have output the built `main.js`.

## Splitting the project up

Now that we have our project being built with Webpack we can begin the task of splitting it up into individual files for each "class" object. We will be making use of ES6 import and export statements to describe our dependencies.

Our `Pixels` object is a good starting place to begin because it is quite basic and requires very little modification. To begin create the new file `src\pixels.class.js`:

```javascript
export default class {
    constructor(options) {
        this.pixels = [];
        this.xPixels = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        this.yPixels = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        this.pixelH = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
        this.pixelW = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;
        this.reset();
    }

    reset() {
        for (let y = 1; y <= this.yPixels; y += 1) {
            for (let x = 1; x <= this.xPixels; x += 1) {
                this.setPixel(
                    x, y, {
                        mouseOver: false,
                        colour: '#000000',
                        on: false,
                        x: ((x - 1) * this.pixelW),
                        y: ((y - 1) * this.pixelH),
                        h: (this.pixelH - 1),
                        w: (this.pixelW - 1)
                    }
                );
            }
        }
    }

    setPixel(row, col, value) {
        this.pixels[this.xPixels * row + col] = value;
    }

    getPixel(row, col) {
        return this.pixels[this.xPixels * row + col];
    }

    getPixels() {
        return this.pixels;
    }

    setPixels(pixels) {
        this.pixels = pixels;
    }
}
```

As you can see from the above we are using the new [ES6 class syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) but aside from the slightly different layout being used the code is almost identical to what we have in our `index.js`. The notable differences here are the use of the class `constructor` and the `let` statement instead of `var` within the `reset` method. The key difference between `let` and `var` within our use of it here are not that noticeable, `let` allows us to declare variables that are limited in scope to the block in which they are declared. So `y` and `x` are only within scope inside their respective for-loops. 

If we had code following the for-loops at the end of the `reset` method then using the `var` statement would leak `y` and `x` into the function scope (global in this case). The use of `let` stops this from happening and gives you greater control over where your variables can be accessed. For more information on the `let` statement, visit the [MDN documentation here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let).
 
Next you can delete the lines relating to the `Pixels` object in your `index.js` and add the following import statement to to top of the file:

```javascript
import Pixels from './pixels.class';
```

Now upon running `npm run build` and refreshing `index.html` in your browser, nothing will have changed visually (hopfully) and the pixel editor will work the same as before.

The `Pixels` object was easy to convert into an ES6 class because it had no external requirements and acted as little more than a data structure. The next object we are going to convert is `Preview` and its dependency on the global `iCanvas` makes it a little more difficult to port.

We begin by creating a `preview.class.js` file:

```js
export default class {
    constructor(options) {
        this.xPixels = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        this.yPixels = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        this.offset = (options !== undefined && options.offset !== undefined) ? options.offset : {x: 341, y: 295};
        this.loaded = false;
        this.cCache = null;

        this.cCanvas = document.createElement('canvas');
        this.cCanvas.width = 43;
        this.cCanvas.height = 36;
        this.cContext = this.cCanvas.getContext("2d");
    }

    render(step, canvas, context) {
        if (!this.loaded) {
            return;
        }
        context.putImageData(this.cCache, this.offset.x, this.offset.y);
    }

    update() {
        this.cContext.clearRect(0, 0, 43, 36);

        this.cContext.font = '10px Arial';
        this.cContext.fillStyle = '#000000';
        this.cContext.fillText('Preview', 3.5, 10);

        this.cContext.fillRect(13, 15, 18, 18);

        this.cContext.fillStyle = '#FFFFFF';
        this.cContext.fillRect(14, 16, 16, 16);

        let mPixels = iCanvas.get('pixels');

        for (let y = 1; y <= this.yPixels; y += 1) {
            for (let x = 1; x <= this.xPixels; x += 1) {
                let currentPixel = mPixels.getPixel(x, y);
                if (currentPixel.on === true) {
                    this.cContext.fillStyle = currentPixel.colour;
                    this.cContext.fillRect((14 + x - 1), (16 + y - 1), 1, 1);
                }
            }
        }

        this.cCache = this.cContext.getImageData(0, 0, 43, 36);
        this.loaded = true;
    }
}
```

You should be able to see similarities between how we ported the `Pixels` object and the above. One thing you should notice is that we are no longer using jQuery to create the canvas element and instead opting to go with vanilla JavaScript.

Adding `import Preview from './preview.class';` to `index.js` and then running `npm run dev` will result in the following error for our new class:

```bash
ERROR in ./src/preview.class.js

H:\pixel-editor\src\preview.class.js
  32:23  error  'iCanvas' is not defined  no-undef

✖ 1 problem (1 error, 0 warnings)
```

In order to fix this we need to modify the `constructor` of our new `Preview` class to accept an instance of our `iCanvas` variable that is set in `index.js`:

```js
constructor(options) {

    // ...

    
    if (options === undefined || options.iCanvas === undefined) {
        throw new Error('Preview requires iCanvas be passed to it.');
    }

    this.iCanvas = options.iCanvas;
}
```

Then in `index.js` we modify the creation of the `iPreview` variable like so:

```js
let iPreview = new Preview({
    iCanvas: iCanvas
});
```

With the above in place, building with `npm run dev` will now build (albeit with linter errors from `index.js`) a working version of our pixel editor.

---

We now have four objects in `index.js` left to port to ES6: `ImageCanvas`, `Palette`, `Mouse` and `App`. Three of them depend on the `Mouse` data structure and as we are writing out our dependency on jQuery the mouse event code will need to be refactored to vanilla js too. So that is what we will focus on next. Create the new file `src/mouse.js` and move the `Mouse` object from `index.js` replacing `var` with `let` like so:

```js
let Mouse = {
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
export {Mouse};
```

As you can see from the above we have exported the `Mouse` object differently than the classes. This is because the `mouse.js` file will contain the event handling code as well.

Next we shall port the mouse event handling code from `index.js` to `mouse.js` by first creating and exporting an empty function called `MouseEvents`:

```js
const MouseEvents = (mainCanvas) => {
    // ...
};

export {Mouse, MouseEvents};
```

Then add the below import to `index.js`.

```js
import {Mouse, MouseEvents} from './mouse';
```

Now returning to our `MouseEvents` function in `mouse.js`. Move all the `mainCanvas.on` functions within the `$(document).ready(function(){` within `index.js` to inside your `MouseEvents` function. Once done find and replace the usage of `mainCanvas.on` with `mainCanvas.addEventListener` and for the time being comment out the `mainCanvas.contextmenu` block:

```js
const MouseEvents = (mainCanvas) => {
    function offset(el) {
        let rect = el.getBoundingClientRect();

        return {
            top: (rect.top + document.body.scrollTop),
            left: (rect.left + document.body.scrollLeft)
        }
    }

    mainCanvas.addEventListener('mouseover', function (e) {
        Mouse.events.mouseover = true;
        Mouse.x = Math.floor(e.clientX - offset(this).left);
        Mouse.y = Math.floor(e.clientY - offset(this).top);
    });

    mainCanvas.addEventListener('mouseout', function () {
        Mouse.events.mousemove = false;
        Mouse.events.mouseover = false;
        Mouse.events.mousedown = false;
        Mouse.events.mouseout = true;
        Mouse.events.mouseButton = 0;

        Mouse.x = 0;
        Mouse.y = 0;
    });

    mainCanvas.addEventListener('mousemove', function (e) {
        Mouse.events.mousemove = true;
        Mouse.x = Math.floor(e.clientX - offset(this).left);
        Mouse.y = Math.floor(e.clientY - offset(this).top);
        return false;
    });

    mainCanvas.addEventListener('mousedown', function (e) {
        Mouse.events.mousedown = true;
        Mouse.events.mouseup = false;
        Mouse.events.mouseButton = e.which;
        return false;
    });

    mainCanvas.addEventListener('mouseup', function () {
        Mouse.events.mousedown = false;
        Mouse.events.mouseup = true;
        Mouse.events.mouseButton = 0;
        return false;
    });

    mainCanvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    })
};

export {Mouse, MouseEvents};
```

With the above our `MouseEvents` function is complete and just needs to be initiated from within our `index.js`. To begin with we need to replace the use of jQuery `$('#paintMe')` with the vanilla equivalent:

```js
let mainCanvas = document.getElementById('paintMe');
```

Then within your `App` object add `MouseEvents(options.canvas);` to the top of the `run` method and remove `get(0)` from the line getting the canvas's context as we no longer need to differentiate between the jQuery object and DOM:

```js
run: function(options)
{
    MouseEvents(options.canvas); // <- Added this line

    var now,
        // ...
        context = options.canvas.getContext("2d"); // <- Modified this line
```

---

Building the project and refreshing `index.html` in your browser will now result in a broken view and an error in your console. This is because both `ImageCanvas` and `Palette` treat `mainCanvas` as if it were a jQuery object. 

```
Uncaught TypeError: t.css is not a function
    at Object.update (index.js:247)
    at update (index.js:441)
    at e (index.js:359)
```

To begin remedying that, we shall first port the `Palette` object by creating `src/palette.class.js`

```js
import {Mouse} from './mouse';

export default class {
    constructor(options) {
        this.offset = (options !== undefined && options.offset !== undefined) ? options.offset : {x: 341, y: 63};
        this.loaded = false;
        this.cCache = null;

        this.cCanvas = document.createElement('canvas');
        this.cCanvas.width = 43;
        this.cCanvas.height = 222;
        this.cContext = this.cCanvas.getContext("2d");

        this.palette = [
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

        this.currentColour = '#000000';
        this.hasFocus = false;
        this.paletteMousePositions = [];
        this.setUpMousePositions();
    }

    setUpMousePositions() {
        this.paletteMousePositions = [];
        let x = 1;
        let y = 1;

        for (let i = 0; i <= this.palette.length - 1; i += 1) {
            let temp = {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                color: this.palette[i]
            };

            temp.x1 = x;
            temp.y1 = y;
            temp.x2 = temp.x1 + 20;
            temp.y2 = temp.y1 + 20;

            x += 21;

            if (i % 2 === 1) {
                y += 21;
                x = 1;
            }
            this.paletteMousePositions[i] = temp;
        }
        this.loaded = true;
    }

    update(step, canvas) {
        // Sometimes this method is called by the main loop before the objects
        // constructor has time to initialise, the following line stops
        // that from happening.
        if (this.loaded === false) {
            return;
        }

        // Check to see if the Pallet object has focus, and resetting the mouse
        // cursor if not.
        if (
            Mouse.x >= this.offset.x &&
            Mouse.x <= (this.offset.x + 43) &&
            Mouse.y >= this.offset.y &&
            Mouse.y <= (this.offset.y + 222)
        ) {
            this.hasFocus = true;
        } else {
            this.hasFocus = false;
            canvas.css('cursor', 'auto');
        }

        if (this.hasFocus === true) {
            // Check to see if the mouse cursor is within the pallet picker
            // area, and over a selectable colour then change the cursor to
            // let the user know that they can interact
            if (
                Mouse.x >= (this.offset.x + 1) &&
                Mouse.x <= (this.offset.x + 43) &&
                Mouse.y >= (this.offset.y + 1) &&
                Mouse.y <= (this.offset.y + 168)
            ) {
                canvas.css('cursor', 'pointer');

                // If the mouse is clicked then the current palette colour
                // to the hex value of the selected item
                if (Mouse.events.mousedown === true) {
                    for (let i = 0; i <= this.paletteMousePositions.length - 1; i += 1) {
                        if (
                            Mouse.x >= (this.offset.x + this.paletteMousePositions[i].x1) &&
                            Mouse.x <= (this.offset.x + this.paletteMousePositions[i].x2) &&
                            Mouse.y >= (this.offset.y + this.paletteMousePositions[i].y1) &&
                            Mouse.y <= (this.offset.y + this.paletteMousePositions[i].y2)
                        ) {
                            if (this.currentColour !== this.paletteMousePositions[i].color) {
                                this.currentColour = this.paletteMousePositions[i].color;
                            }
                        }
                    }
                }

            } else {
                canvas.css('cursor', 'auto');
            }
        }
    }

    render(step, canvas, context) {

        // Sometimes this method is called by the main loop before the objects
        // constructor has time to initialise, the following line stops
        // that from happening.
        if (this.loaded === false) {
            return;
        }

        // Clear the Palette context, ready for a re-draw
        this.cContext.clearRect(0, 0, 42, 170);

        // Draw a border and background
        this.cContext.fillStyle = "#000000";
        this.cContext.fillRect(0, 0, 43, 169);
        this.cContext.fillStyle = "#000000";
        this.cContext.fillRect(0, 179, 43, 43);

        // Draw each coloured box for the pallet
        let x = 1;
        let y = 1;

        for (let i = 0; i <= this.palette.length - 1; i += 1) {
            this.cContext.fillStyle = this.palette[i];
            this.cContext.fillRect(x, y, 20, 20);

            x += 21;

            if (i % 2 === 1) {
                y += 21;
                x = 1;
            }
        }

        // Draw the current colour
        this.cContext.fillStyle = this.currentColour;
        this.cContext.fillRect(1, 180, 41, 41);

        // Get the image data from the palette context and apply
        // it to the main canvas context passed through by the
        // main loop
        context.putImageData(this.cContext.getImageData(0, 0, 43, 222), this.offset.x, this.offset.y);
    }

    getCurrentColour() {
        return this.currentColour;
    }
}
```

As you can see from the above, the port of `Palette` into a ES6 class is similar to how we ported the `Preview` object. As with `Preview` we have have swapped out the use of jQuery for vanilla js to create the canvas object within the new class constructor and replaced usages of `var` with `let` and `privateVars` with `this` throughout. In addition you will notice on lines 60 and 154 the use of `===` instead of `==`, this is best practice as it removes the risk of unexpected type coercion (not that, that would happen on the lines affected, just a good habit to get into.)

There are three places in our new `Palette` class where we are still using the jQuery `css` method, on lines 88, 101 and 121. These all need converting to vanilla js which is fortunately quite simple to do:

```js

// Replace:
canvas.css('cursor', 'auto');

// With:
canvas.style.cursor = 'auto';

// Then replace:
canvas.css('cursor', 'pointer');

// With:
canvas.style.cursor = 'pointer';
```

Upon importing `Palette` into your `index.js` with `import Palette from './palette.class';` rebuilding and refreshing `index.html` in your browser you should now see no more errors in the console and have a working application.

---

Next we are going to port our `App` object to ES6. As with `Palette` this is quiet simple. Create `app.class.js`:

```js
import {MouseEvents} from "./mouse";
export default class {
    constructor (options)
    {
        MouseEvents(options.canvas);

        let now,
            dt       = 0,
            last     = timestamp(),
            slow     = options.slow || 1, // slow motion scaling factor
            step     = 1/options.fps,
            slowStep = slow * step,
            update   = options.update,
            render   = options.render,
            canvas   = options.canvas,
            context  = options.canvas.getContext("2d");

        function timestamp () {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        }

        function frame() {
            now = timestamp();
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
}
```

In converting it to a ES6 class, there has been minimal adjustments made to the `App` object. Once done you can remove the `MouseEvents` import from `index.js` and add and import for the new `App` class like so:

```js
import {Mouse} from './mouse';
import App from './app.class';
```

Next, in order for the application to still work you need to replace `App.run({` in `index.js` with `new App({` so that the class gets constructed. 

Once done we now turn our attention to the final object to be refactored `ImageCanvas`. As with the previous refactorings we move the objects code from `index.js` into its own file `src\image-canvas.class.js` and replace instances of `var` with `let`, usages of jQuery with vanilla and any unused variables to keep the linter happy:

```js
import {Mouse} from "./mouse";
import Pixels from "./pixels.class";

export default class {
    constructor(options) {
        this.xPixels = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        this.yPixels = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        this.pixelH = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
        this.pixelW = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;

        this.offset = (options !== undefined && options.offset !== undefined) ? options.offset : {x: 10, y: 10};

        this.pixels = new Pixels({
            xPixels: this.xPixels,
            yPixels: this.yPixels,
            pixelW: this.pixelW,
            pixelH: this.pixelH
        });

        this.cWidth = (this.xPixels * this.pixelW);
        this.cHeight = (this.yPixels * this.pixelH);
        this.hasFocus = false;

        this.cCanvas = document.createElement('canvas');
        this.cCanvas.width = this.cWidth;
        this.cCanvas.height = this.cHeight;
        this.cContext = this.cCanvas.getContext("2d");

        this.cContext.fillStyle = '#999999';
        this.cContext.fillRect(0, 0, this.cWidth, this.cHeight);

        this.cContext.fillStyle = '#FFFFFF';
        this.cContext.fillRect(1, 1, (this.cWidth - 2), (this.cHeight - 2));

        this.cContext.beginPath();
        this.cContext.strokeStyle = "#DDDDDD";
        this.cContext.lineWidth = "1";

        for (let y = 20; y <= this.cHeight; y += this.pixelH) {
            this.cContext.moveTo(0.5 + y, 1);
            this.cContext.lineTo(0.5 + y, this.cHeight - 1);
        }

        for (let x = 20; x <= this.cWidth; x += this.pixelW) {
            this.cContext.moveTo(1, 0.5 + x);
            this.cContext.lineTo(this.cWidth - 1, 0.5 + x);
        }

        this.cContext.stroke();

        this.cGrid = this.cContext.getImageData(0, 0, this.cWidth, this.cHeight);

        if (options === undefined || options.iPalette === undefined) {
            throw new Error('ImageCanvas requires iPalette be passed to it.');
        }

        this.iPalette = options.iPalette;
    }

    get(prop) {
        if (this.hasOwnProperty(prop)) {
            return this[prop];
        }
    }

    // eslint-disable-next-line no-unused-vars
    load(pixels) {
        // ...
    }

    save() {
        // ...
    }

    update() {
        if (
            (Mouse.x > 0 && Mouse.y > 0) &&
            (Mouse.x >= 0 && Mouse.x <= this.cWidth) &&
            (Mouse.y >= 0 && Mouse.y <= this.cHeight)
        ) {
            this.hasFocus = true;
        } else {
            this.hasFocus = false;
        }

        if (this.hasFocus === true) {
            for (let y = 1; y <= this.yPixels; y += 1) {
                for (let x = 1; x <= this.xPixels; x += 1) {
                    let currentPixel = this.pixels.getPixel(x, y);

                    // Reset mouseover
                    currentPixel.mouseOver = false;

                    if (Mouse.x >= (this.offset.x + currentPixel.x) && Mouse.x <= (this.offset.x + currentPixel.x + currentPixel.w)) {
                        if (Mouse.y >= (this.offset.y + currentPixel.y) && Mouse.y <= (this.offset.y + currentPixel.y + currentPixel.h)) {
                            currentPixel.mouseOver = true;
                            if (Mouse.events.mousedown === true) {
                                // If the left mouse button is pressed then switch the
                                // pixel on and set its colour. Otherwise switch the pixel
                                // off and reset its colour.
                                if (Mouse.events.mouseButton === 1) {
                                    currentPixel.on = true;
                                    currentPixel.colour = this.iPalette.getCurrentColour();
                                } else {
                                    currentPixel.on = false;
                                    currentPixel.colour = '#FFFFFF';
                                }
                            }
                        }
                    }
                    this.pixels.setPixel(x, y, currentPixel);
                }
            }
        }
    }

    render(step, canvas, context) {
        context.putImageData(this.cGrid, this.offset.x, this.offset.y);

        for (let y = 1; y <= this.yPixels; y += 1) {
            for (let x = 1; x <= this.xPixels; x += 1) {
                let currentPixel = this.pixels.getPixel(x, y);

                if (currentPixel.on === true) {
                    // Use the currentPixel.colour to display the pixel
                    context.fillStyle = currentPixel.colour;
                    context.fillRect(
                        (this.offset.x + currentPixel.x + 1),
                        (this.offset.y + currentPixel.y + 1),
                        (this.pixelW - 1),
                        (this.pixelH - 1)
                    );
                }

                if (currentPixel.mouseOver === true) {
                    context.fillStyle = 'rgba(0,0,0,0.2)';
                    context.fillRect(
                        (this.offset.x + currentPixel.x + 1),
                        (this.offset.y + currentPixel.y + 1),
                        (this.pixelW - 1),
                        (this.pixelH - 1)
                    );
                }
            }
        }
    }
}
```

`ImageCanvas` has a dependency on `iPalette` from `index.js` so in the same way that we passed `iCanvas` to the `Prevew` class we have added code to the constructor to accept `iPallete` being passed on construction. 

You will notice that there are two methods `save` and `load` in our `ImageCanvas` object and you may well wonder why in [part five](/blog/tutorials/writing-a-pixel-editor-in-javascript-p5/) that we didn't amend the `save` method with the code for saving down as a png. The answer is that I forgot that it existed, this part and part five have been written three years after part four and any of the `ImageCanvas` code so until refactoring and writing this just now I didn't realise it existed.

Once the above is complete you can replace the `Pixels` import in `index.js` with `import ImageCanvas from './image-canvas.class';` and then update the class constructors for iPalette, iCanvas and iPreview like so:

```js
let iPalette = new Palette();
let iCanvas  = new ImageCanvas({
    iPalette: iPalette
});
let iPreview = new Preview({
    iCanvas: iCanvas
});
```

---

That is the bulk of the refactoring into ES6 complete, all that is left now is to remove the last vestiges of jQuery dependency from `index.js` and move the save functionality into the `save` method of our `ImageCanvas` class.

We will begin by updating the save method of our `ImageCanvas` class:

```js
save() {
    let eCanvas = document.createElement('canvas');
    eCanvas.width = 16;
    eCanvas.height = 16;
    let eContext = eCanvas.getContext("2d");

    for (let y = 1; y <= 16; y += 1) {
        for (let x = 1; x <= 16; x += 1) {
            let currentPixel = this.pixels.getPixel(x, y);
            if (currentPixel.on === true) {
                eContext.fillStyle = currentPixel.colour;
                eContext.fillRect((x - 1), (y - 1), 1, 1);
            }
        }
    }

    let link = document.createElement('a');
    link.download = 'image.png';
    link.href = eCanvas.toDataURL("image/png");
    link.click();
}
```

You can see above, aside from stripping out the dependency on jQuery and accessing the `pixels` property of `ImageCanvas` directly nothing else needed refactoring. With everything else complete the only thing left to do is refactor `index.js` to both tidy it up and set the event listener for the save method.

```js
import {Mouse} from './mouse';
import App from './app.class';
import ImageCanvas from './image-canvas.class';
import Preview from './preview.class';
import Palette from './palette.class';

// eslint-disable-next-line no-unused-vars
(function (window, document, undefined) {
    let iPalette = new Palette();
    let iCanvas = new ImageCanvas({iPalette: iPalette});
    let iPreview = new Preview({iCanvas: iCanvas});
    let mainCanvas = document.getElementById('paintMe');

    document.getElementById('saveBtn').addEventListener('click', () => {iCanvas.save()});

    new App({
        canvas: mainCanvas,
        fps: 60,
        update: function (step, canvas, context) {
            // Has the mouse event changed since it was last logged?
            if (Mouse.previousEvents.mouseover !== Mouse.events.mouseover) {
                Mouse.previousEvents.mouseover = Mouse.events.mouseover;
            }

            if (Mouse.previousEvents.mousemove !== Mouse.events.mousemove) {
                Mouse.previousEvents.mousemove = Mouse.events.mousemove;
            }

            if (Mouse.previousEvents.mouseup !== Mouse.events.mouseup) {
                Mouse.previousEvents.mouseup = Mouse.events.mouseup;
            }

            if (Mouse.previousEvents.mousedown !== Mouse.events.mousedown) {
                Mouse.previousEvents.mousedown = Mouse.events.mousedown;
            }

            if (Mouse.previousEvents.mouseButton !== Mouse.events.mouseButton) {
                Mouse.previousEvents.mouseButton = Mouse.events.mouseButton;
            }

            iCanvas.update(step, canvas, context);
            iPreview.update(step, canvas, context);
            iPalette.update(step, canvas, context);
        },
        render: function (step, canvas, context) {
            iCanvas.render(step, canvas, context);
            iPreview.render(step, canvas, context);
            iPalette.render(step, canvas, context);
        }
    });
}(window, document));
```

Once done you should be able to remove `<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>` from `index.html` and build using `npm run dev` with no linter errors!

---

Upon refreshing `index.html` in your browser, nothing will have changed visually. On the face of it the pixel editor functions just as well now as it did at the end of part five except now the backend is a lot more organised and has better cross-browser support thanks to Babel.

As an aside, this lack of visual improvement in correlation to the improved programming is one of the most frustrating parts of developing software.

Thank you so much for reading this tutorial, next in part seven, we will add a tool bar and both a paint bucket tool and undo history.

[^1]: That is unless you have node_modules saved to your global git ignore list
[^2]: It's a little weird that Webpack reports one error here while there are 23 problems reported by eslint. That is because Webpack is counting how many error states it receives of which there is one - eslint.
