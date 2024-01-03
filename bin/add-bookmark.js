#!/usr/bin/env node

const {Select, Input, Confirm} = require('enquirer');
const {slugify} = require("../lib/filters");
const {DateTime} = require('luxon');
const fetch = require("node-fetch");
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const yargs = require("yargs");
const fs = require('fs');

/**
 * Add Bookmark Tool
 *
 * A quick and dirty script that allows for adding bookmarks to the
 * content folder of this repository.
 *
 * @todo support adding multiple topics to a bookmark
 * @todo check that a link has not already been added
 * @todo remember author details per domain so no need to re-enter if bookmarking another page
 */

let added = [];

const fetchUrl = async (url, date) => {
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

    const topics = [
      'Nifty Show and Tell',
      'Notable Articles',
      'list/blogroll',
      'list/webring',
      'list/forum',
      'list/www-club',
      'list/games',
      'list/e-magazine'
    ];

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

      title = (await prompt.run()).trim();
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

      author = (await prompt.run()).trim();
    }

    const topicPrompt = new Select({
      name: 'topic',
      message: 'Pick a Main Topic',
      choices: topics
    });

    const topic = await topicPrompt.run();

    const filename = `${date}-${slugify(title)}.md`;
    const pathname = `${__dirname}/../src/content/resources/bookmarks/${filename}`;

    if (fs.existsSync(pathname)) {
      console.log(`File exists at [${pathname}]`);
      return 1;
    }

    const frontMatter = {
      title,
      tags: [topic],
      cite: {
        name: author,
        href: url,
      }
    };

    fs.writeFileSync(pathname, `---\n${yaml.dump(frontMatter)}\n---\n`);

    added.push(frontMatter);
  } catch (e) {
    console.error(e.message);
    return 1;
  }
}

const main = async (argv) => {
  let code = -1;
  let {url} = argv;

  const datePrompt = new Input({
    message: 'Date (YYYY-MM-DD)',
    initial: DateTime.now().toFormat('yyyy-LL-dd')
  });

  const date = await datePrompt.run();

  while(code === -1) {
    if (!url) {
      const prompt = new Input({
        message: 'Website URL (or Q to quit)',
        initial: ''
      });

      url = (await prompt.run()).trim();
      if (!url) {
        console.warn('[!] Please enter a valid url, or Q to quit')
        continue;
      } else if (url.toUpperCase() === 'Q') {
        break;
      }
    }

    code = await fetchUrl(url, date);
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

  if (added.length > 0) {
    console.log('Added Bookmark Wikilinks:')
    added.forEach(a => console.log(`![[ ${a.title} ]]`));
  }

  return code;
}

const options = yargs
  .usage("Usage: -u <url>")
  .option("u", {alias: "url", describe: "Webpage Url", type: "string", demandOption: false})
  .argv;

main(options).then(code => process.exit(code));