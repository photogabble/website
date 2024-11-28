import EleventyFetch from '@11ty/eleventy-fetch';

// TODO: refactor into 11ty plugin

const username = 'carbontwelve';
const shelves = ['read', 'to-read', 'reading'];
const fetchConfig = {
  duration: '1d',
  type: 'json',
};

export default async function () {
  const allBooks = [];
  const allAuthors = [];

  for (const shelf of shelves) {
    let nextPage = 1;

    while (nextPage) {
      let url = `https://bookwyrm.social/user/${username}/shelf/${shelf}.json?page=${nextPage}`;

      console.log('[@photogabble/bookwyrm]', `Fetching bookwyrm shelf [${shelf}/${nextPage}]`);

      const data = await EleventyFetch(url, fetchConfig);

      if (data.type !== 'OrderedCollectionPage' || (Array.isArray(data?.orderedItems) && data.orderedItems.length === 0)) continue;

      for (const item of data.orderedItems) {
        if (!item.openlibraryKey) {
          console.warn('[@photogabble/bookwyrm]', 'WARNING', `Book ${item.title} <${item.id}> has no open library key set, skipping.`)
          continue;
        }

        const authors = await Promise.all(item.authors.map(async id => {
          const found = allAuthors.find(author => author.id === id);
          if (found) return found;

          const data = await EleventyFetch(`${id}.json`, {...fetchConfig, duration: '14d'});
          allAuthors.push(data);
          return data;
        }));

        allBooks.push({...item, shelf, authors});
      }

      if (data.next) {
        // data.next only exists if there are more pages.
        const matches = data.next.match(/\?page=([0-9]+)/);
        nextPage = matches[1];
      } else {
        nextPage = undefined; // break out of while loop
      }
    }
  }

  return allBooks;
}
