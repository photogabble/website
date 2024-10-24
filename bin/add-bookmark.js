#!/usr/bin/env node

import enquirer from 'enquirer';
import {DateTime} from 'luxon';
import path from 'node:path'
import yargs from "yargs";
import fs from 'node:fs';
import {Bookmark} from '../lib/actions/add-bookmark.js'

const {Input, Confirm} = enquirer;

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

export const command = 'add:bookmark';
export const desc = 'plant a new bookmark in to the digital garden';

export const builder = (yargs) => {
  yargs.option("u", {alias: "url", describe: "Webpage Url", type: "string", demandOption: false})
};

export const handler = async ({url}) => {
  let code = -1;
  // Identify paths

  const src = [
    path.join(process.cwd(), '../src'),
    path.join(process.cwd(), './src'),
  ].reduce((carry, value) => {
    if (carry !== false) return carry;
    if (fs.existsSync(value)) carry = value;
    return carry;
  }, false);

  if (src === false) {
    console.error('Unable to find src path, please run this command from project root dir.');
    return 1;
  }

  const paths = {
    img: path.join(src, '../public/img/bookmarks'),
    md: path.join(src, 'content/resources/bookmarks')
  };

  const datePrompt = new Input({
    message: 'Date (YYYY-MM-DD)',
    initial: DateTime.now().toFormat('yyyy-LL-dd')
  });

  const date = await datePrompt.run();
  let urlPrompt, continuePrompt;

  while(true) {
    urlPrompt = new Input({
      message: 'Website URL (or Q to quit)',
      initial: ''
    });

    const url = (await urlPrompt.run()).trim();

    if (!url) {
      console.warn('[!] Please enter a valid url, or Q to quit')
      continue;
    } else if (url.toUpperCase() === 'Q') {
      break;
    }

    let bookmark = new Bookmark(paths, url, date);
    await bookmark.run();

    continuePrompt = new Confirm({
      name: 'question',
      message: 'Want to add more bookmarks?'
    });

    if (!(await continuePrompt.run())) break;
  }

  if (added.length > 0) {
    console.log('Added Bookmark Wikilinks:')
    added.forEach(a => console.log(`![[ ${a.title} ]]`));
  }

  return code;
}
