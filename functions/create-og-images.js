const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const makeImage = async (src, dist) => {
  const html = fs.readFileSync(src, 'utf8');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
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

const fileReadable = (path) => {
  if (fs.existsSync(path)) return true;
  console.warn(`Unable to open: ${path}`);
  return false;
}

(async () => {
  try {
    let posts = require("./_posts.json");
    const promises = [];

    posts = posts.map((post) => {
      return {
        ...post,
        src: path.join(process.cwd(), post.template),
        dist: path.join(process.cwd(), `_assets/og-image/${post.slug}.jpg`),
      };
    }).filter((post) => !(fileReadable(post.dist) === true || fileReadable(post.src) === false))

    if (posts.length > 0) {
      process.setMaxListeners(posts.length + 10);

      posts.forEach((post) => {
        console.log(`Processing ${post.template}`);
        promises.push(makeImage(post.src, post.dist));
      });

      await Promise.all(promises);
    }
    console.log(`Completed processing ${posts.length} items`);
  } catch (e) {
    console.warn(e.message);
    process.exit(1);
  }
})();