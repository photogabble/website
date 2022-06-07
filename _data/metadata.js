module.exports = {
    commit: {
        ref: process.env.COMMIT_REF || null,
        url: process.env.REPOSITORY_URL
    },
    title: "PhotoGabble",
    description: "Blog and general digital garden of the full stack programmer Simon Dann.",
    url: "https://photogabble.co.uk",
    feedUrl: "https://photogabble.co.uk/blog/feed.xml",
    author: {
        name: "Simon Dann",
        email: "simon@photogabble.co.uk"
    }
}