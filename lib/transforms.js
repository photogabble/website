import {minify} from 'html-minifier';

export default {
    htmlmin: (content, outputPath) => {
        if (
            process.env.ELEVENTY_ENV === 'production' &&
            outputPath &&
            outputPath.endsWith('.html')
        ) {
            return minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
        }
        return content
    }
}
