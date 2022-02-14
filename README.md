# PhotoGabble Website

## About this repository
This repository contains the source code for [www.photogabble.co.uk](https://www.photogabble.co.uk). It is built with [Eleventy](https://www.11ty.dev/) and deployed on [Netlify](https://www.netlify.com/).

## Getting Started
You will need to install the required packages using `npm install`. There are three commands for building:

- `npm run build` to build the project for deploying
- `npm run dev:postcss` to start the postcss watch service for building css
- `npm run serve:dev` to build and serve with eleventy in development environment
- `npm run serve:prod` to build and serve with eleventy in production environment (drafts filtered)

> Note: The first time you serve for local development using either `serve:dev` or `serve:prod` you will want to run those before then running `dev:postcss` otherwise it will complain. Once successfully run the first time the start up order doesn't matter.

## Contributing
If you notice something wrong or broken, please let me know by opening an issue, or better yet, a pull request with how you think it should be fixed.

## License
Released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License. See [LICENSE](https://creativecommons.org/licenses/by-nc-sa/4.0/).
