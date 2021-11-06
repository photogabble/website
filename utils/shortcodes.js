module.exports = {

    /**
     * @see https://gist.github.com/dirtystylus/d488ea82fec9ebda8308a288015d019b
     * @param {string} image
     * @param {string} caption
     * @param {string} className
     * @returns {string}
     */
    figure: (image, caption, className) => {
        const classMarkup = className ? ` class="${className}"` : '';
        const captionMarkup = caption ? `<figcaption>${caption}</figcaption>` : '';
        return `<figure${classMarkup}><img src="${image}" />${captionMarkup}</figure>`;
    },

    version: () => String(Date.now()),

}