const git = require('simple-git')();
const ObjectCache = require("./cache");
const {DateTime} = require('luxon');
const chalk = require("chalk");
const crypto = require("node:crypto");
const fs = require("node:fs");

let cache;

async function initCache() {
  console.log(chalk.blue('[@photogabble/git-history]'), 'Loading Cache');
  cache = new ObjectCache(`git-history`);
}

function getFileHash(pathname) {
  const content = fs.readFileSync(pathname);
  return crypto.createHash("md5").update(content).digest("hex");
}

async function getChanges(data) {
  if (!cache) await initCache();

  let status;
  if (cache.has('git-status')) {
    status = cache.get('git-status');
  } else {
    status = await git.status();
    cache.set('git-status', status, 300);
  }

  // Do not attempt to get git status for files that have not been added to git or
  // those that have been created but not committed.
  const excludedFiles = [...status.not_added, ...status.created].map(path => `./${path}`);
  // Dirty files should be removed from the cache, and not have their history cache TTL be
  // greater than 300 seconds.
  status.files
    .map(file => `./${file.path}`)
    .filter(path => !excludedFiles.includes(path))
    .forEach((path) => cache.forget(path));

  const filePathname = data.page.inputPath;
  if (excludedFiles.includes(filePathname)) return [];

  const fileHash = getFileHash(filePathname);
  const cached = cache.get(filePathname);

  if (cached) {
    if (cached.hash === fileHash) return cached.history;
    console.log(chalk.blue('[@photogabble/git-history]'), 'File content for [' + chalk.green(filePathname) + '] changed, fetching fresh git history');
  } else {
    console.log(chalk.blue('[@photogabble/git-history]'), 'Fetching fresh git history for: [' + chalk.green(filePathname) + ']');
  }

  try {
    const history = await git.log({file: filePathname});
    const mapped = history.all.map(el => ({
      ...el,
      hash: el.hash,
      date: DateTime.fromISO(el.date).toLocaleString(DateTime.DATE_FULL),
      url: `https://github.com/photogabble/website/commit/${encodeURIComponent(el.hash)}`
    }));

    cache.set(filePathname, {
      hash: fileHash,
      history: mapped,
    }, cache.forever);

    return mapped;
  } catch (e) {
    return null;
  }
}

module.exports = {
  getChanges
}
