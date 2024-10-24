import * as bookmark from './add-bookmark.js';
import * as weeknote from './add-week-in-review.js';
import * as check from './check-week-in-review.js'
import path from "node:path";
import fs from "node:fs";

export const getSrcDirectory = () => [
  path.join(process.cwd(), '../src'),
  path.join(process.cwd(), './src'),
].reduce((carry, value) => {
  if (carry !== false) return carry;
  if (fs.existsSync(value)) carry = value;
  return carry;
}, false);

export const getCurrentWorkingDirectory = () => {
  const src = getSrcDirectory();
  if (!src) throw new Error('Unable to find src folder, are you running me from project root?');
  return path.join(src, '..');
}

export const commands = [
  bookmark,
  weeknote,
  check
];
