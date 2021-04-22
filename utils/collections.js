const post = (collection) => {
    if (process.env.ELEVENTY_ENV !== 'production')
        return [...collection.getFilteredByGlob('./posts/*.md')]
    else
        return [...collection.getFilteredByGlob('./posts/*.md')].filter((post) => !post.data.draft)
}

const postCategories = (collection) => {
    const posts = post(collection)

    // Here we use a set to reduce the categories used in our posts into a unique list,
    // that set is then converted into an array and sorted alphabetically before being
    // mapped and reduced into a paginated structure for use in templates

    let categories = Array.from(posts.reduce((categories, post) => {
        if (post.data['categories']){
            post.data['categories'].forEach(category => categories.add(category.toLowerCase()))
        }
        return categories
    }, new Set())).sort()


    return posts
}

module.exports = {
    post,
    postCategories
}