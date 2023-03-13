module.exports = {
  eleventyComputed: {
    book(data) {
      // @see https://www.11ty.dev/docs/data-computed/#declaring-your-dependencies
      const dependencies = [data.page, data.bookwyrm];
      if (dependencies[0] === undefined || !dependencies[1]) return {};
      return data.bookwyrm.find(book => book.openlibraryKey === data.page.fileSlug);
    },
    title(data) {
      const dependencies = data.book;
      if (!dependencies) return '';
      return data.book.title;
    }
  }
}