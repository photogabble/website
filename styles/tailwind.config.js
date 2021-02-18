module.exports = {
    purge: {
        content: ["_site/**/*.html"],
        options: {
            safelist: [],
        },
    },
    theme: {
        extend: {
            colors: {
                change: "transparent",
            },
        },
    },
    variants: {},
    plugins: [],
};