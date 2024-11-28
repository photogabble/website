import lists from '../../src/_data/lists-meta.js';
import {slugify} from "../filters.js";
import * as cheerio from 'cheerio';
import Table from 'cli-table';
import enquirer from 'enquirer';
import fetch from "node-fetch";
import path from 'node:path'
import yaml from 'js-yaml';
import fs from 'node:fs';

const {Select, Input, Confirm} = enquirer;
const selectYourOwn = 'Other, enter your own';
const topics = [
  'Nifty Show and Tell',
  'Notable Articles',
  ...Object.keys(lists),
];

export class Bookmark {
  constructor(paths, url, date) {
    this.paths = paths;
    this.url = url;
    this.date = date;
  }

  async run() {
    // 1. Fetch html from this.url
    await this.fetch();

    // 2. Ask which title to use
    this.title = await this.askSingle('Pick a title', this.titles, 'Title');

    // 3. Ask which author to use
    this.author = await this.askSingle('Pick a author', this.authors, 'Author');
    // 4. Ask which topics to use
    this.topics = await this.askMultiple('Pick a Topic', topics);
    //  TODO 4a. If contains `list/digital-graveyard` then ask for wayback url
    //  TODO 4b. If contains `list/button-board` then ask for button filename(s)
    // 5. Confirm and save md
    while(true) {
      const table = new Table({ chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''} });
      table.push(['url', this.url]);
      table.push(['title', this.title]);
      table.push(['author', this.author]);
      table.push(['topics', this.topics.length > 0 ? this.topics.join(', ') : 'none']);
      console.log(table.toString());

      const answer = await this.askSingle('Please choose an action', ['Save', 'Edit Title', 'Edit Author', 'Edit Topics', 'Cancel'])

      if (answer === 'Save') break;
      if (answer === 'Cancel') return false;
      if (answer === 'Edit Title') {
        this.title = await this.edit('Title', this.title);
      } else if (answer === 'Edit Author') {
        this.author = await this.edit('Author', this.author);
      } else if (answer === 'Edit Topics') {
        await this.editTopics();
      }
    }

    await this.persistMarkdown();

    // 6. Prompt screenshot generation

    return true;
  }

  async fetch() {
    const response = await fetch(this.url);
    const html = await response.text();
    this.$ = cheerio.load(html);

    this.titles = [...new Set([
      this.$('title').text(),
      this.$('meta[property="og:title"]').attr('content'),
      this.$('meta[name="twitter:title"]').attr('content'),
    ].filter(Boolean)), selectYourOwn];

    this.authors = [...new Set([
      this.$('meta[name="copyright"]').attr('content'),
      this.$('meta[name="author"]').attr('content'),
      this.$('meta[name="twitter:creator"]').attr('content'),
      this.$('meta[name="article:author"]').attr('content')
    ].filter(Boolean)), selectYourOwn];

    console.log(`Fetched: ${this.url}`);
  }

  async persistMarkdown() {
    const filename = `${this.date}-${slugify(this.title)}.md`;
    const pathname = path.join(this.paths.md, filename);

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

    console.log(`Writing file: ${pathname}`);
    fs.writeFileSync(pathname, `---\n${yaml.dump(frontMatter).trim()}\n---\n`);

    return frontMatter;
  }

  async edit(message, initial = '') {
    const prompt = new Input({
      message,
      initial
    });

    return (await prompt.run()).trim();
  }

  async editTopics() {
    while(true) {
      console.log(`Current Topics: ${this.topics.join(', ')}`);

      const prompt = new Input({message: "What do you want to do (A)dd, (R)emove or (C)ontinue?"});
      const answer = (await prompt.run()).trim().toLowerCase();

      if (answer === 'c' || answer === 'continue') return;
      if (answer === 'r' || answer === 'remove') {
        const remove = await this.askMultiple('Remove which topics?', this.topics);
        this.topics = this.topics.filter(topic => remove.includes(topic) === false);
      } else if (answer ==='a' || answer === 'add') {
        this.topics = await this.askMultiple('Pick a Topic', topics, this.topics);
      }
    }
  }

  async askSingle(message, choices, ownMessage) {
    const titlePrompt = new Select({
      message,
      choices,
    });

    let choice = (await titlePrompt.run()).trim();

    if (choice === selectYourOwn) {
      const prompt = new Input({
        message: ownMessage,
        initial: ''
      });

      choice = (await prompt.run()).trim();
    }

    return choice;
  }

  async askMultiple(message, choices, chosen = []) {
    while(true) {
      if (chosen.length > 0) {
        console.log(`Selected: ${chosen.join(', ')}`);
      }

      const ask = new Select({
        message,
        choices: choices.filter(choice => chosen.includes(choice) === false),
      });

      chosen.push(await ask.run());

      const more = new Confirm({
        message: 'More?',
      });

      if (!(await more.run())) break;
    }
    return chosen;
  }
}

export class AddBookmark {
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
