const fetch = require("node-fetch");
const cheerio = require("cheerio");
const lists = require("../../src/_data/lists-meta");
const {Select, Input, Confirm} = require("enquirer");
const {slugify} = require("../filters");
const fs = require("fs");
const yaml = require("js-yaml");

const selectYourOwn = 'Other, enter your own';

const topics = [
  'Nifty Show and Tell',
  'Notable Articles',
  ...Object.keys(lists),
];

class Bookmark {
  constructor(url) {
    this.url = url.trim();
    this.title = '';
    this.author = '';
    this.topics = [];
  }

  async run() {
    const response = await fetch(this.url);
    const html = await response.text();
    const $ = cheerio.load(html);

    console.log(`URL: ${this.url}`);

    this.titles = [...new Set([
      $('title').text(),
      $('meta[property="og:title"]').attr('content'),
      $('meta[name="twitter:title"]').attr('content'),
    ].filter(Boolean)), selectYourOwn];

    this.authors = [...new Set([
      $('meta[name="copyright"]').attr('content'),
      $('meta[name="author"]').attr('content'),
      $('meta[name="twitter:creator"]').attr('content'),
      $('meta[name="article:author"]').attr('content')
    ].filter(Boolean)), selectYourOwn];

    await this.askTitle();
    await this.askAuthor();
    await this.askTopics();

    console.log('===')
    console.log(`URL: ${this.url}`);
    console.log(`Title: ${this.title}`);
    console.log(`Author: ${this.author}`);
    console.log(`Topics: ${this.topics.join(', ')}`);
    console.log('===')

    // TODO: Confirm, and allow editing of title or author

    // TODO If topics contains `list/digital-graveyard` then ask for wayback url

    // TODO If topics contains `list/button-board` then ask for button filename(s)
  }

  async askTitle() {
    const titlePrompt = new Select({
      name: 'title',
      message: 'Pick a title',
      choices: this.titles,
    });

    this.title = (await titlePrompt.run()).trim();

    if (this.title === selectYourOwn) {
      const prompt = new Input({
        message: 'Title',
        initial: ''
      });

      this.title = (await prompt.run()).trim();
    }
  }

  async askAuthor() {
    const authorPrompt = new Select({
      name: 'author',
      message: 'Pick an author',
      choices: this.authors,
    });

    this.author = await authorPrompt.run();

    if (this.author === selectYourOwn) {
      const prompt = new Input({
        message: 'Author',
        initial: ''
      });

      this.author = (await prompt.run()).trim();
    }
  }

  async askTopics() {
    let answer = true;

    while (answer) {
      if (this.topics.length > 0) {
        console.log(`Selected topics: ${this.topics.join(', ')}`);
      }

      const topicPrompt = new Select({
        name: 'topic',
        message: 'Pick a Topic',
        choices: topics
      });

      this.topics.push(await topicPrompt.run());

      const prompt = new Confirm({
        name: 'question',
        message: 'Want to add more topics?'
      });

      answer = await prompt.run();
    }
  }

  async write(date) {
    const filename = `${date}-${slugify(this.title)}.md`;
    const pathname = `${__dirname}/../../src/content/resources/bookmarks/${filename}`;

    if (fs.existsSync(pathname)) {
      const prompt = new Confirm({
        name: 'question',
        message: `File exists at [${pathname}], overwrite?`
      });

      const answer = await prompt.run();

      if (!answer) return false;
    }

    const frontMatter = {
      title: this.title,
      tags: this.topics,
      cite: {
        name: this.author,
        href: this.url,
      }
    };

    fs.writeFileSync(pathname, `---\n${yaml.dump(frontMatter).trim()}\n---\n`);

    return frontMatter;
  }
}

class AddBookmark {
  constructor() {
    this.added = [];
  }

  async fetch(urls, date) {
    if (typeof urls === 'string') {
      urls = [urls];
    }

    for (const url of urls) {
      const bookmark = new Bookmark(url);
      await bookmark.run();

      const frontMatter = await bookmark.write(date);
      if (frontMatter !== false) this.added.push(frontMatter);
    }
  }
}

module.exports = {
  AddBookmark
};
