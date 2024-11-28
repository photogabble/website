import puppeteer from 'puppeteer';
import * as crypto from "node:crypto";
import * as fs from 'node:fs';
import * as path from 'node:path';

// Initialization Vector
const IV = Buffer.from('068f7bb47896981d6c8b3f9a186591ae', 'hex');
/**
 * @see https://gist.github.com/timargra/016f247dd83dbc97ea1d8f71dea38c3f
 * @param {*} data
 * @param {number} size
 * @param {BufferEncoding} encoding
 * @returns {string}
 */
const variableHash = (data, size = 5, encoding = 'hex') => {
  let output = Buffer.alloc(size);
  let hash = crypto.createHash('sha256');
  hash.update(data);

  let cipher = crypto.createCipheriv('aes256', hash.digest(), IV);
  let offset = output.write(cipher.update(output).toString('binary'));
  output.write(cipher.final().toString('binary'), offset);
  return output.toString(encoding);
}

/**
 * @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig
 * @param { * } customOptions
 */
export default function (eleventyConfig, customOptions = {}) {
  const distFolder = path.join(process.cwd(), `public/img/bookmarks`);
  const viewport = [1200, 630];
  const timeout = 8500;

  eleventyConfig.addAsyncShortcode('screenshot', async (url, filename) => {
    const hash = variableHash(url, 12);
    const filePathName = path.join(distFolder, `${filename}.${hash}.jpeg`);
    const src = `/img/bookmarks/${filename}.${hash}.jpeg`;

    if (fs.existsSync(filePathName)) return src;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    /*
    const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
    await page.setUserAgent(customUA);
    */

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

    return src;
  });
}
