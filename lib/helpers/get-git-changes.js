const git = require('simple-git')();
const ObjectCache = require("./cache");
const {DateTime} = require('luxon');
const chalk = require("chalk");

let cache;
async function initCache() {
  console.log(chalk.blue('[@photogabble/git-history]'), 'Loading Cache');
  const gitHash = await git.revparse( ['--short', 'HEAD']);
  cache = new ObjectCache(`git-${gitHash}`);
}

async function getChanges(data) {
  if (!cache) await initCache();
  const filePathname = data.page.inputPath;
  if (cache.has(filePathname)) return cache.get(filePathname);

  console.log(chalk.blue('[@photogabble/git-history]'), 'Fetching git history for: [' + chalk.green(filePathname) + ']');

  try {
    const history = await git.log({file: filePathname});
    const mapped = history.all.map(el =>( {
      ...el,
      date: DateTime.fromISO(el.date).toLocaleString(DateTime.DATE_FULL),
      url: `https://github.com/photogabble/website/commit/${encodeURIComponent(el.hash)}`
    }));
    cache.set(filePathname, mapped, cache.forever);
    return mapped;
  } catch (e) {
    return null;
  }
}

module.exports = {
  getChanges
}
