#!/usr/bin/env node

const {Select, Input, Confirm} = require('enquirer');
const {slugify} = require("../utils/filters");
const fetch = require("node-fetch");
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const yargs = require("yargs");
const fs = require('fs');

let added = [];

const fetchUrl = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const selectYourOwn = 'Other, enter your own';

    const titles = [...new Set([
      $('title').text(),
      $('meta[property="og:title"]').attr('content'),
      $('meta[name="twitter:title"]').attr('content'),
    ].filter(Boolean)), selectYourOwn];

    const authors = [...new Set([
      $('meta[name="copyright"]').attr('content'),
      $('meta[name="author"]').attr('content'),
      $('meta[name="twitter:creator"]').attr('content'),
      $('meta[name="article:author"]').attr('content')
    ].filter(Boolean)), selectYourOwn];

    const titlePrompt = new Select({
      name: 'title',
      message: 'Pick a title',
      choices: titles
    });

    let title = await titlePrompt.run();

    if (title === selectYourOwn) {
      const prompt = new Input({
        message: 'Title',
        initial: ''
      });

      title = await prompt.run();
    }

    const authorPrompt = new Select({
      name: 'author',
      message: 'Pick an author',
      choices: authors
    });

    let author = await authorPrompt.run();

    if (author === selectYourOwn) {
      const prompt = new Input({
        message: 'Author',
        initial: ''
      });

      author = await prompt.run();
    }

    const now = new Date();
    const filename = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}-${String(now.getDay()).padStart(2, '0')}-${slugify(title)}.md`;
    const pathname = `${__dirname}/../content/resources/bookmarks/${filename}`;

    if (fs.existsSync(pathname)) {
      console.log(`File exists at [${pathname}]`);
      return 1;
    }

    const frontMatter = {
      title,
      tags: [],
      cite: {
        name: author,
        href: url,
      }
    };

    fs.writeFileSync(pathname, `---\n${yaml.dump(frontMatter)}\n---\n`);

    added.push(frontMatter);
  } catch (e) {
    console.error(e);
    return 1;
  }
}

const main = async (argv) => {
  let code = -1;
  let {url} = argv;

  while(code === -1) {
    if (!url) {
      const prompt = new Input({
        message: 'Website URL',
        initial: ''
      });

      url = await prompt.run()
    }

    code = await fetchUrl(url);
    const prompt = new Confirm({
      name: 'question',
      message: 'Want to add more bookmarks?'
    });

    const answer = await prompt.run();
    if (answer === true) {
      code = -1;
      url = undefined;
    }
  }

  added.forEach(a => console.log(`![[ ${a.title} ]]`));

  return code;
}

const options = yargs
  .usage("Usage: -u <url>")
  .option("u", {alias: "url", describe: "Webpage Url", type: "string", demandOption: false})
  .argv;

main(options).then(code => process.exit(code));