#!/usr/bin/env node

const {AddBookmark} = require("../lib/actions/add-bookmark");
const yargs = require("yargs");
const {DateTime} = require("luxon");
const fs = require('fs');
const editor = require('@inquirer/editor').default;

// Started with #33 on 2nd April 2023 but that was a double entry and so
// to simplify the math for this "brute force approach" lets start from
// the following week 15 of 2023.
const entryStart = 34;
const entryStartDate = DateTime.fromFormat(`2023 15`, 'kkkk W').plus({days: 6});

const numbers = new Set(['1','2','3','4','5','6','7','8','9','0']);

const isNumber = (str) => {
  return numbers.has(str);
}

const main = async (argv) => {
  const bookmarkAdder = new AddBookmark();

  let {week, year} = argv;
  const today = DateTime.now();

  if (typeof year === 'undefined') year = today.weekYear;
  if (typeof week === 'undefined') week = today.weekNumber;

  // Luxon will return the Monday of the given week number, I post week in review on that weeks Sunday
  // therefore, I need to add six days to the date.
  const moment = DateTime.fromFormat(`${year} ${week}`, 'kkkk W').plus({days: 6});
  const publishDate = moment.toFormat('yyyy-LL-dd');
  const filename = `${publishDate}-${year}-wk-${week}-in-review.md`;
  const title = `${year}, Week ${week} in Review`;

  const entryNumber = moment.diff(entryStartDate, 'weeks');
  const currentEntryNumber = entryStart + entryNumber.weeks;

  if (entryNumber.weeks < 0) {
    console.error('Unable to generate joke and quote files for this date.')
    return 1;
  }

  const files = [
    {
      filename: `${publishDate}-${year}-wk-${week}-in-review.md`,
      path: `${__dirname}/../src/content/thoughts`,
      frontmatter: {
        title: `${year}, Week ${week} in Review`,
        tags: ['Week In Review'],
        growthStage: 'evergreen',
      }
    },
    {
      filename: `${publishDate}-dad-joke-${currentEntryNumber}.md`,
      path: `${__dirname}/../src/content/resources/jokes`,
      frontmatter: {
        title: `Dad Joke #${currentEntryNumber}`,
        tags: ['DadJoke'],
        cite: {
          name: 'Unknown'
        }
      }
    },
    {
      filename: `${publishDate}-weekly-quote-${currentEntryNumber}.md`,
      path: `${__dirname}/../src/content/resources/quotes`,
      frontmatter: {
        title: `Weekly Quote #${currentEntryNumber}`,
        tags: ['Quote'],
        cite: {
          name: 'Unknown'
        }
      }
    },
  ];

  // TODO use editor to ask for week in review, quote and joke body text to be added to the body of those files

  for (const file of files) {
    const pathName = `${file.path}/${file.filename}`;
    if (fs.existsSync(pathName)) {
      console.warn(`File exists at ${pathName}, not over-writing`);
    } else {
      console.log(`Creating ${pathName}`);
    }
  }

  const answer = await editor({
    message: 'Enter Notable Articles',
  });

  const lines = answer.trim().split("\n");
  const groups = {};

  // If I never set a day then default to the Sunday.
  let urlDate = moment;
  let lineNumber = 1;
  const parsed = new Map();

  parsed.set(urlDate.toFormat('yyyy-LL-dd'), new Set());

  for (const line of lines) {
    // if line begins with a number it's a day of week e.g 1st, 15th, 22nd, 3rd
    // else if lines begins with a hyphen it's a url

    const char = line.substring(0, 1);
    if (char === '-') {
      const url = line.substring(2);
      parsed.get(urlDate.toFormat('yyyy-LL-dd')).add(url);
    } else if (!isNaN(Number(char))) {
      let day = '';
      for (const c of line) {
        if (isNumber(c)) {
          day += c
        } else {
          break;
        }
      }

      urlDate = moment.set({day});

      // urlDate must be before Sunday, if it isn't then subtract one month as this happens when
      // the sunday is the beginning of a month e.g. 2023-10-01.

      const urlDiff = moment.diff(urlDate, 'days');
      if (urlDiff.days < 0) urlDate = urlDate.minus({month: 1})

      if (!parsed.has(urlDate.toFormat('yyyy-LL-dd'))){
        parsed.set(urlDate.toFormat('yyyy-LL-dd'), new Set());
      }
    } else {
      console.error(`Unable to parse line ${lineNumber}: ${line}`);
    }

    lineNumber++;
  }

  for (const date of parsed.keys()) {
      const urls = parsed.get(date);
      if (urls.size === 0) continue;

    await bookmarkAdder.fetch(Array.from(urls.values()), date);
  }

  return 0;
};

const options = yargs
  .usage("Usage: -w <week> -y <year>")
  .option("w", {alias: "week", describe: "Week of year, defaults to this week", type: "number", demandOption: false})
  .option("y", {alias: "year", describe: "Year, defaults to this year", type: "number", demandOption: false})
  .argv;

main(options).then(code => process.exit(code));
