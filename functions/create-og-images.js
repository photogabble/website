const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const makeImage = async (src, dist) => {
  const html = fs.readFileSync(src, 'utf8');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setContent(html);
  await page.setViewport({
    width: 1280,
    height: 640,
    deviceScaleFactor: 1
  });
  await page.screenshot({
    path: dist,
    quality: 70
  });
  await browser.close();
};

(async () => {
  try {
    const posts = require("./_posts.json");
    const promises = [];

    process.setMaxListeners(posts.length + 10);

    posts.forEach((post) => {
      const src = path.join(process.cwd(), post.template);
      const dist = path.join(process.cwd(), `_assets/og-image/${post.slug}.jpg`);

      if (!fs.existsSync(dist)) {
        console.log(`Processing ${post.template}`);
        promises.push(makeImage(src, dist));
      }
    });

    await Promise.all(promises);
    console.log('Complete');
  } catch (e) {
    console.warn(e.message);
    process.exit(1);
  }
})();