# PhotoGabble Website
[![Netlify Status](https://api.netlify.com/api/v1/badges/6c8303d1-5395-4372-8359-e346e8896cba/deploy-status)](https://app.netlify.com/sites/photogabble/deploys)

## About this repository
This repository contains the source code for [www.photogabble.co.uk](https://www.photogabble.co.uk). It is built with [Eleventy](https://www.11ty.dev/) and deployed on [Netlify](https://www.netlify.com/).

## Prerequisites

- Node.js v20+
- Screenshots require Chromium dependencies to be available, I had to install `libnss3` via `apt install libnss3`

## Installing on Windows
This project has a dependency on [`node-canvas`](https://github.com/Automattic/node-canvas) which itself is dependant upon both `node-gyp` and `GTK 2` being installed. See the [node-canvas installation guide for Windows](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows) for information on how to install those dependencies; npm will not install until they are met.

## Getting Started
You will need to install the required packages using `npm install`. There are three commands for building:

- `npm run build` to build the project for deploying
- `npm run serve:dev` to build and serve with eleventy in development environment
- `npm run serve:prod` to build and serve with eleventy in production environment (drafts filtered)

## 🤖 Contributing
If you notice something wrong or broken, please let me know by opening an issue, or better yet, a pull request with how you think it should be fixed.

## 🪪 License
Unless otherwise stated, the source code is released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. See [LICENSE](https://creativecommons.org/licenses/by-nc-sa/4.0/). There are certain exemptions to this, explicitly to code snippets I have mirrored, which each contain their license terms where available.
