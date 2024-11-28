import fs from 'node:fs';
import path from 'node:path';
import {DateTime} from "luxon";
import {getCurrentWorkingDirectory} from "./index.mjs";
import chalk from 'chalk';

// Started with #33 on 2nd April 2023 but that was a double entry and so
// to simplify the math for this "brute force approach" lets start from
// the following week 15 of 2023.
const entryStart = 34;
const entryStartDate = DateTime.fromFormat(`2023 15`, 'kkkk W').plus({days: 6});

export const command = 'check:weeknote';

export const desc = 'sanity check week in review file tree';

export const builder = (yargs) => {
  yargs.option("y", {alias: "year", describe: "Year, defaults to this year", type: "number", demandOption: false});
  yargs.option("e", {alias: "excluding", describe: "Excluding, comma delimited", type: "string", demandOption: false});
};

export const handler = ({year, excluding}) => {
  const cwd = getCurrentWorkingDirectory();

  const today = DateTime.now();
  let ignored = (excluding ?? '').split(',');
  if (typeof year === 'undefined') year = today.weekYear;
  console.log(`Checking Week In Review Parity for ${chalk.blue(year)}, excluding [${chalk.yellow(excluding ?? 'none')}]`);

  if (typeof year === 'undefined') year = today.weekYear;
  const isThisYear = year === today.weekYear;
  const now = DateTime.now();

  const lines = [];

  for (let week = 1; week<= 52; week++) {
    if (ignored.indexOf(String(week)) > -1) continue;

    const line = {message: '', children: []};
    const moment = DateTime.fromFormat(`${year} ${week}`, 'kkkk W').plus({days: 6});
    const publishDate = moment.toFormat('yyyy-LL-dd');
    const entryNumber = moment.diff(entryStartDate, 'weeks');

    // Do not continue if asked for this year and the date is in the future.
    if (isThisYear && moment >= now) break;

    // Check entry exists for week
    const filename = `${publishDate}-${year}-wk-${week}-in-review.md`;

    const pathName = path.join(cwd, `src/content/thoughts/${filename}`);
    if (!fs.existsSync(pathName)) {
      line.message = `Missing entry for week ${chalk.yellow(week)} -> ${chalk.yellow(filename)}`;
    }

    // Before I introduced separate files for jokes and quotes.
    if (entryNumber.weeks < 0) continue;

    const currentEntryNumber = entryStart + entryNumber.weeks;

    // Check joke exists for week
    const jokeFilename = `${publishDate}-dad-joke-${currentEntryNumber}.md`;
    const jokePathname = path.join(cwd, `src/content/resources/jokes/${jokeFilename}`);

    if (!fs.existsSync(jokePathname)) {
      line.children.push(`Missing joke entry for week ${week} -> ${jokePathname}`);
    }

    // Check quote exists for week
    const quoteFilename = `${publishDate}-weekly-quote-${currentEntryNumber}.md`;
    const quotePathname = path.join(cwd, `src/content/resources/quotes/${quoteFilename}`);

    if (!fs.existsSync(quotePathname)) {
      line.children.push(`Missing quote entry for week ${week} -> ${quotePathname}`);
    }

    // If the file is found then message is not set, however the file might exist but we detect missing joke/quote/etc
    // then it still must have a message
    if (line.message === '' && line.children.length > 0) {
      line.message = `Missing Meta for week ${week} -> ${filename}`;
    }
    if (line.children.length === 0 && line.message === '') continue;
    lines.push(line);
  }

  console.log('.');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isLast = i === lines.length - 1;
    const prefix = i < lines.length - 1
      ? (line.children.length > 0)
        ? '├'
        : '│'
      : '└';

    console.log(`${prefix} ${line.message}`);

    for(let n = 0; n < line.children.length; n++) {
      const prefix = n < line.children.length - 1
        ? (isLast) ? '  ├' : '│ ├'
        : (isLast) ? '  └' : '│ └';

      console.log(`${prefix} ${line.children[n]}`);
    }
  }

  return 0;
};
