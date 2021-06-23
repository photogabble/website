const fetch = require("node-fetch");

const username = 'carbontwelve';

module.exports = async function() {
  console.log(`Fetching bookwyrm feed for [${username}]…`);

  const numberOfPages = await fetch(`https://bookwyrm.social/user/${username}/outbox`)
    .then(res => res.json())
    .then(json => {
      if (json.first === json.last) {
        return 1;
      }

      const last = new URL(json.last);
      return Number(last.searchParams.get('page'));
    })

  /**
   * @param page {Number}
   * @return {Array}
   */
  const fetchPage = async (page) => {
    return await fetch(`https://bookwyrm.social/user/${username}/outbox?page=${page}`)
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
  }

  let books = [];

  for (let page = 1; page <= numberOfPages; page++) {
    console.log(`Fetching bookwyrm feed for [${username}] page ${page} of ${numberOfPages}…`);
    const items = await fetchPage(page);
    items.every(item => books.push(item));
  }

  return Promise.all(books);

};