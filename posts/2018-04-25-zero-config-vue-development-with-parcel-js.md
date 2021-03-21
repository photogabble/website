---

title: Zero config, rapid Vue.js development with Parcel
draft: false
cover_image: /assets/img/featured-images/zero-config-vue-development-with-parcel-js.png
categories:
    - tutorials

tags:
    - javascript
    - vue.js
    - parcel
---

I was recently pointed towards [ParcelJS](https://parceljs.org/) a _zero configuration_ web application bundler while looking for something with less setup that could replace webpack for small projects and tinkering. Having used Parcel for a while to quickly get project prototypes built I noticed in the documentation that it supports vue.js.

If you're unaware, _the_ canonical method for building and bundling a Vue.js application is with [webpack](https://webpack.js.org/) and all the configuration plus boilerplate that comes with it.  There is an official [vue-cli](https://github.com/vuejs/vue-cli) project for zero config, rapid prototyping. However at time of writing it is still in beta and comes with the warning to _do not use in production yet unless you are adventurous._

So lets see how to set up ParcelJS for developing a Vue.js app.

## Build the Project Skeleton

Before we do anything `npm` related, lets go ahead an set up our application directory structure. First create your project directory and then within it create a new directory called `src`.

Once you are done with this tutorial your project folder should have the following structure:
```bash
parcel-vue-project/
├── .babelrc
├── .gitignore
├── index.html
├── package.json
└── src
    ├── App.vue
    └── main.js
```

Next create the file `index.html` in your project directory with the following content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My ParcelJS Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- Parcel will rewrite this path on build. -->
    <script src="./src/main.js"></script>
  </body>
</html>
```

Pretty much a basic `index.html`, you may note however that the script `src` is a relative path - this will be rewritten by ParcelJS on build.

Now create the file `src/main.js` with the following content:

```js
import Vue from 'vue';
import App from './App.vue';

new Vue({
  el: '#app',
  render: h => h(App)
});
```

Followed by the App component file `src/App.vue` with the following content:

```vue
<template>
  <div id="app">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Hurray! ParcelJS Zero Config Vue app is running!'
    }
  }
}
</script>

<style lang="css">
  #app {
    color: red;
  }
</style>
```

Finally create the file `.babelrc` in the project directory with the following content:

```json
{
  "presets": [
    "env"
  ]
}
```

## Installing Dependencies

If you have not already done so install ParcelJS with `npm install -g parcel-bundler` (more information on getting started [here](https://parceljs.org/getting_started.html)) then create a `package.json` file in your project directory using `npm init -y` (omit the `-y` if you wish to answer the questions.)

Now within your `package.json` add the following start script:

```json
"scripts": {
  "dev": "parcel",
  "build": "parcel build"
}
```

Finally run the following two commands to install your project dependencies:

+ `npm install --save vue`
+ `npm install --save-dev parcel-bundler`

## Building the project with ParcelJS

With the skeleton of your application built you will now be able to run your app with hot reloading by running `npm run dev` in your project directory. You will notice on the command line Parcel use npm to pull down additional project packages before it builds, serves on [http://127.0.0.1:1234](http://127.0.0.1:1234) and watches for changes to hot reload all with zero configuration on your part!

If you want to use less or sass they are supported by ParcelJS out of the box, for more information on ParcelJS's supported asset types check out the [official documentation here](https://parceljs.org/assets.html).

## .gitignore

Once built you will notice a number of build/development related folders that you will not want to commit to your git repository (assuming you are using git.) Therefore you will need to create a `.gitignore` with at least the following content:

```
.cache
dist
node_modules
```

[![Parcel Zero Config VueJS Project Skeleton](/assets/img/github.png "Github")](https://github.com/photogabble/parcel-vue-js-zero-config-project-skeleton)