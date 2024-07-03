// Converts url slug into title case.
// Source: https://github.com/cassidoo/next-prankz/blob/master/pages/news/%5Barticle%5D.js#L9-L24
export default (slug) => {
  return slug
    .split('-').join(' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
