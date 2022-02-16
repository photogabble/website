const {chunk, toTitleCase} = require('./helpers')

// Main blog collection
const post = (collection) => {
    if (process.env.ELEVENTY_ENV !== 'production')
        return [...collection.getFilteredByGlob('./posts/*.md')]
    else
        return [...collection.getFilteredByGlob('./posts/*.md')].filter((post) => !post.data.draft)
}

// Collection of all categories found in blog collection
const postCategories = (collection) => {
    const posts = post(collection)
    return Array.from(posts.reduce((categories, post) => {
        if (post.data['categories']) {
            post.data['categories'].forEach(category => categories.add(category.toLowerCase()))
        }
        return categories
    }, new Set())).sort().map((category) => {
        return {
            title: toTitleCase(category),
            slug: category
        }
    })
}

// Collection of blog posts segmented by category.
// I wrote this based upon code found in the following article:
// https://www.webstoemp.com/blog/basic-custom-taxonomies-with-eleventy/
const postByCategories = (collection) => {
    const posts = post(collection).reverse()
    const postsPerPage = 20

    // Here we use a set to reduce the categories used in our posts into a unique list,
    // that set is then converted into an array and sorted alphabetically before being
    // mapped to equal an object containing the category slug and all posts that have
    // been categorised as it.

    return postCategories(collection).map((category) => {
        let slugs = []

        const chunks = chunk(posts.filter((post) => {
            let postCategories = post.data.categories || []
            return postCategories.includes(category.slug)
        }), postsPerPage)

        for (let i = 0; i < chunks.length; i++) {
            slugs.push(i > 0 ? `${category.slug}/${i + 1}` : category.slug)
        }

        let pages = [];

        // Convert our chunks into a struct that eleventy understands for pagination.
        chunks.forEach((posts, idx) => {
            pages.push({
                title: category.title,
                slug: slugs[idx],
                pageNumber: idx + 1,
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

const projects = (collection) => {
    return [...collection.getFilteredByGlob('./projects/*.md')];
}

module.exports = {
    post,
    postCategories,
    postByCategories,
    projects
}
