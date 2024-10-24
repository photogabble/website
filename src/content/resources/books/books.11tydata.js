export default {
  tags: ['resource/books'],
  sidebar_component: 'books',
  sidebar_shelves: ['read'],
  eleventyComputed: {
    book(data) {
      // @see https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
      const dependencies = [data.page, data.bookwyrm];
      if (dependencies[0] === undefined || !dependencies[1]) return {};
      return data.bookwyrm.find(book => book.openlibraryKey === data.page.fileSlug);
    },
    title(data) {
      return (!data.book) ? '' : data.book.title;
    },
    permalink(data) {
      return (!data.page) ? '' : `resources/books/${data.page.fileSlug}/`;
    },
  },
}
