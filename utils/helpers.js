// Array chunking function.
// Source: https://github.com/30-seconds/30-seconds-of-code
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
);

// Converts url slug into title case.
// Source: https://github.com/cassidoo/next-prankz/blob/master/pages/news/%5Barticle%5D.js#L9-L24
const toTitleCase = (slug) => {
    return slug
        .split('-').join(' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

module.exports = {
    chunk,
    toTitleCase
}