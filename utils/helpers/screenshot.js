const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig
 * @param { * } customOptions
 */
module.exports = function (eleventyConfig, customOptions = {}) {

  const distFolder = path.join(process.cwd(), `img/bookmarks`);

  eleventyConfig.addAsyncShortcode('screenshot', async (url, filename) => {
    const filePathName = path.join(distFolder, `${filename}.jpeg`);
    if (fs.existsSync(filePathName)) return `/img/bookmarks/${filename}.jpeg`;

    const timeout = 8500;
    const viewport = [1200, 630];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: viewport[0],
      height: viewport[1],
      deviceScaleFactor: 1
    });

    // Borrowed from https://github.com/11ty/api-screenshot/blob/v1/functions/screenshot.js
    let response = await Promise.race([
      page.goto(url, {
        waitUntil: ["load"],
        timeout,
      }),
      new Promise(resolve => {
        setTimeout(() => {
          resolve(false); // false is expected below
        }, timeout - 1500); // we need time to execute the window.stop before the top level timeout hits
      }),
    ]);

    if (response === false) { // timed out, resolved false
      await page.evaluate(() => window.stop());
    }

    await page.screenshot({
      path: filePathName,
      type: 'jpeg',
      quality: 80,
      fullPage: false,
      captureBeyondViewport: false,
      clip: {
        x: 0,
        y: 0,
        width: viewport[0],
        height: viewport[1],
      }
    });

    await browser.close();

    return `/img/bookmarks/${filename}.jpeg`
  });

}