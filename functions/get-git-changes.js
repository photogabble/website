const git = require('simple-git')();
const {DateTime} = require('luxon');

async function getChanges(data) {
  const options = {
    file: data.page.inputPath,
  }

  try {
    const history = await git.log(options);
    const mapped = history.all.map(el =>( {...el, date: DateTime.fromISO(el.date).toLocaleString(DateTime.DATE_FULL), url: `https://github.com/photogabble/website/commit/${encodeURIComponent(el.hash)}`}))
    return mapped
  } catch (e) {
    return null;
  }
}

module.exports = {
  getChanges
}
