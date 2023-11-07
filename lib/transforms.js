const htmlmin = require('html-minifier');

module.exports = {
    htmlmin: (content, outputPath) => {
        if (
            process.env.ELEVENTY_ENV === 'production' &&
            outputPath &&
            outputPath.endsWith('.html')
        ) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
        }
        return content
    }
}