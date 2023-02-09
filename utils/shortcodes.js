module.exports = function loadShortcodes(eleventyConfig) {
    return {
        /**
         * @see https://gist.github.com/dirtystylus/d488ea82fec9ebda8308a288015d019b
         * @param {string} image
         * @param {string} caption
         * @param {string} alt
         * @param {string} className
         * @returns {string}
         */
        figure: (image, caption, alt, className) => {
            const classMarkup = className ? ` class="${className}"` : '';
            const captionMarkup = caption ? `<figcaption>${caption}</figcaption>` : '';
            const imgMarkup = alt ? `<img src="${image}" alt="${alt}" />` : `<img src="${image}" />`;
            return `<figure${classMarkup}>${imgMarkup}${captionMarkup}</figure>`;
        },

        resource(collection, id) {

            const page = this.page;

            const n = 1;
            // <pre>{{ content }}</pre>
            // <small>Source: {{ title }} by {{ cite.name }} | <a href="{{ cite.href }}" title="Visit {{ title }} source by {{ cite.name }}">link</a></small>
        },

        version: () => String(Date.now()),
    };
};