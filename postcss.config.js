module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-url')({
            url: 'copy',
            assetsPath: 'assets',
            useHash: true
        }),
        require('autoprefixer'),
        require('@fullhuman/postcss-purgecss')({
            content: [
                './**/*.html',
                './**/*.njk',
                './**/*.js',
                './**/*.md',
            ],
            safelist: [
              /^theme-/
            ]
        }),
        require('postcss-minify'),
    ],
};
