module.exports = {

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

    version: () => String(Date.now()),

}