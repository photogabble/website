#!/usr/bin/env node

const yargs = require("yargs");
const {DateTime} = require("luxon");
const fs = require('fs');

// Started with #33 on 2nd April 2023 but that was a double entry and so
// to simplify the math for this "brute force approach" lets start from
// the following week 15 of 2023.
const entryStart = 34;
const entryStartDate = DateTime.fromFormat(`2023 15`, 'kkkk W').plus({days: 6});

const main = async (argv) => {
  let {year, excluding} = argv;
  const today = DateTime.now();

  let ignored = (excluding ?? '').split(',');
  console.log(`Checking Week In Review Parity for ${year}, excluding [${excluding}]`);

  if (typeof year === 'undefined') year = today.weekYear;

  for (let week = 1; week<= 52; week++) {
    if (ignored.indexOf(String(week)) > -1) continue;

    const moment = DateTime.fromFormat(`${year} ${week}`, 'kkkk W').plus({days: 6});
    const publishDate = moment.toFormat('yyyy-LL-dd');

    const entryNumber = moment.diff(entryStartDate, 'weeks');

    // Check entry exists for week

    const filename = `${publishDate}-${year}-wk-${week}-in-review.md`;

    const pathName = `${__dirname}/../src/content/thoughts/${filename}`;
    if (!fs.existsSync(pathName)) {
      console.warn(`Missing entry for week ${week} -> ${filename}`);
    }

    // Before I introduced separate files for jokes and quotes.
    if (entryNumber.weeks < 0) continue;

    const currentEntryNumber = entryStart + entryNumber.weeks;

    // Check joke exists for week

    const jokeFilename = `${publishDate}-dad-joke-${currentEntryNumber}.md`;
    const jokePathname = `${__dirname}/../src/content/resources/jokes/${jokeFilename}`;

    if (!fs.existsSync(jokePathname)) {
      console.warn(`Missing joke entry for week ${week} -> ${jokePathname}`);
    }

    // Check quote exists for week

    const quoteFilename = `${publishDate}-weekly-quote-${currentEntryNumber}.md`;
    const quotePathname = `${__dirname}/../src/content/resources/quotes/${quoteFilename}`;

    if (!fs.existsSync(quotePathname)) {
      console.warn(`Missing quote entry for week ${week} -> ${quotePathname}`);
    }
  }

  return 0;
};

const options = yargs
  .usage("Usage: -w <week> -y <year>")
  .option("y", {alias: "year", describe: "Year, defaults to this year", type: "number", demandOption: false})
  .option("e", {alias: "excluding", describe: "Excluding, comma delimited", type: "string", demandOption: false})
  .argv;

main(options).then(code => process.exit(code));
