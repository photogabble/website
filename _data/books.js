const flatCache = require("flat-cache");
const fetch = require("node-fetch");
const chalk = require("chalk");

const username = 'carbontwelve';
let hasTimedOut = false;
const fetchUrl = async (url, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {signal: controller.signal});
  clearTimeout(id);

  return response;
};

module.exports = async function() {
  if (hasTimedOut) {
    console.log(chalk.blue('[@photogabble/bookwyrm]'), chalk.yellow('WARNING'), 'Not re-fetching upstream feed. Restart process to try again');
    return [];
  }

  console.log(chalk.blue('[@photogabble/bookwyrm]'), 'Fetching bookwrym feed');

  let cache = flatCache.load('bookwyrm-social-api');

  const cachedItem = cache.getKey('books');

  if (cachedItem) {
    const ttl = Math.floor(cachedItem.ttl - (Date.now() / 1000));

    if (ttl > 0) {
      console.log(chalk.blue('[@photogabble/bookwyrm]'), `Found Cached bookwyrm feed for [${username}]…`);
      return cachedItem.data;
    }
  }

  const numberOfPages = await fetchUrl(`https://bookwyrm.social/user/${username}/outbox`)
    .then(res => res.json())
    .then(json => {
      if (json.first === json.last) return 1;
      const last = new URL(json.last);
      return Number(last.searchParams.get('page'));
    }).catch(e => {
      console.warn(chalk.blue('[@photogabble/bookwyrm]'), chalk.yellow('WARNING'), 'Upstream has gone away, unable to fetch bookwyrm outbox before timeout');
      hasTimedOut = true;
      return 0;
    });

  const fetchPage = async (page) => {
    return await fetchUrl(`https://bookwyrm.social/user/${username}/outbox?page=${page}`)
      .then(res => res.json())
      .then(json => {
        if (json.type === 'OrderedCollectionPage' && json.orderedItems.length > 0) {
          return json.orderedItems.filter(item => item.type === 'Article');
        }
        return [];
      })
      .then(items => items.map(async item => {
        const book = await fetch(item.inReplyToBook + '.json').then(res => res.json()).then(edition => {
          const authors = edition.authors.map(author => {
            return fetch(author + '.json').then(res => res.json()).then(author => author.name)
          })

          const cover = edition.cover ?
            {
              src: edition.cover.url,
              alt: edition.cover.name
            } : null;

          return Promise.all(authors).then((authors) => {
            return {
              id: edition.id,
              title: edition.title,
              authors: authors,
              publishedDate: edition.publishedDate,
              review: item.content,
              cover
            }
          })
        })
        return {
          id: item.id,
          published: new Date(item.published),
          rating: item.rating,
          content: item.content,
          book
        }
      }))
      .catch(e => {
        console.warn(chalk.blue('[@photogabble/bookwyrm]'), chalk.yellow('WARNING'), 'Upstream has gone away, unable to fetch bookwyrm outbox before timeout');
        hasTimedOut = true;
        return [];
      });
  }

  let books = [];

  for (let page = 1; page <= numberOfPages; page++) {
    console.log(chalk.blue('[@photogabble/bookwyrm]'), `Fetching bookwyrm feed for [${username}] page ${page} of ${numberOfPages}…`);
    const items = fetchPage(page);
    items.every(item => books.push(item));
  }

  const items = await Promise.all(books).then(found => {
    // Filter out duplicates due to https://github.com/bookwyrm-social/bookwyrm/issues/1214
    let ids = [];
    return found.filter((book) => {
      if (ids.includes(book.id)){
        return false;
      }
      ids.push(book.id);
      return true;
    })
  });

  // If we have items to cache, then cache them.
  if (items.length > 0) {
    cache.setKey('books', {
      ttl: Math.floor((Date.now() / 1000) + (30 * 60)),
      data: items,
    });
    cache.save();
    console.log(chalk.blue('[@photogabble/bookwyrm]'), 'cache persisted');
  }

  return items;
};
