let plugins = [
    require('postcss-import'),
    require('postcss-url')({
        url: 'copy',
        assetsPath: 'assets'
    }),
    require('autoprefixer'),
];

if (process.env.ELEVENTY_ENV === 'production') {
    // These all take time to process and are best done in production only.
    plugins = [
      ...plugins,
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
    ];
}

module.exports = {
    plugins
};
