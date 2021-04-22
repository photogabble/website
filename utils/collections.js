//Source: https://github.com/30-seconds/30-seconds-of-code
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
);

// Source: https://github.com/cassidoo/next-prankz/blob/master/pages/news/%5Barticle%5D.js#L9-L24
const toTitleCase = (slug) => {
    return slug
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

const post = (collection) => {
    if (process.env.ELEVENTY_ENV !== 'production')
        return [...collection.getFilteredByGlob('./posts/*.md')]
    else
        return [...collection.getFilteredByGlob('./posts/*.md')].filter((post) => !post.data.draft)
}

const postCategories = (collection) => {
    const posts = post(collection)
    return Array.from(posts.reduce((categories, post) => {
        if (post.data['categories']){
            post.data['categories'].forEach(category => categories.add(category.toLowerCase()))
        }
        return categories
    }, new Set())).sort().map((category) => {
        return {
            title: toTitleCase(category.split('-').join(' ')),
            slug: category
        }
    })
}

// For this collection I have taken code from:
// https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/ and
// refactored it into a chained array mutation without need for external libraries.
const postByCategories = (collection) => {
    const posts = post(collection)
    const postsPerPage = 4

    // Here we use a set to reduce the categories used in our posts into a unique list,
    // that set is then converted into an array and sorted alphabetically before being
    // mapped to equal an object containing the category slug and all posts that have
    // been categorised as it.

    return postCategories(collection).map((category) => {
        let slugs = []

        const chunks = chunk(posts.filter((post) => {
            let postCategories = post.data.categories || []
            return postCategories.includes(category.slug)
        }),postsPerPage)

        for (let i = 0; i < chunks.length; i++) {
            slugs.push(i  > 0 ? `${category.slug}/${i+1}` : category.slug)
        }

        let pages = [];

        // Convert our chunks into a struct that eleventy understands for pagination.
        chunks.forEach((posts, idx) => {
            pages.push({
                title: category.title,
                slug: slugs[idx],
                pageNumber: idx,
                totalPages: slugs.length,
                pageSlugs: {
                    all: slugs,
                    next: slugs[idx + 1] || null,
                    previous: slugs[idx - 1] || null,
                    first: slugs[0] || null,
                    last: slugs[slugs.length - 1] || null
                },
                items: posts
            })
        })
        return pages
    }).reduce((pages, all) => {
        // Each category was mapped as an array of pages, this needs
        // flattening for the final return.
        return [...all, ...pages]
    }, []);
}

module.exports = {
    post,
    postCategories,
    postByCategories
}