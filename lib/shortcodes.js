const markdown = require('./helpers/markdown');
const Image = require('@11ty/eleventy-img');
const outdent = require('outdent');
const {stringifyAttributes} = require('./helpers/stringify-attributes')

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
    const captionMarkup = caption ? `<figcaption>${markdown.render(caption)}</figcaption>` : '';
    const imgMarkup = alt ? `<img src="${image}" alt="${alt}" />` : `<img src="${image}" />`;
    return `<figure${classMarkup}>${imgMarkup}${captionMarkup}</figure>`;
  },

  image: async (src, alt, className = undefined, widths = [400, 800, 1280], formats = ['webp', 'jpeg'], sizes = '100vw') => {
    const imageMetadata = await Image(src, {
      widths: [...widths],
      formats: [...formats, null],
      outputDir: '_site/img/optimised',
      urlPath: '/img/optimised',
    });

    const sourceHtmlString = Object.values(imageMetadata)
      // Map each format to the source HTML markup
      .map((images) => {
        // The first entry is representative of all the others
        // since they each have the same shape
        const {sourceType} = images[0];

        // Use our util from earlier to make our lives easier
        const sourceAttributes = stringifyAttributes({
          type: sourceType,
          // srcset needs to be a comma-separated attribute
          srcset: images.map((image) => image.srcset).join(', '),
          sizes,
        });

        // Return one <source> per format
        return `<source ${sourceAttributes}>`;
      })
      .join('\n');

    const getLargestImage = (format) => {
      const images = imageMetadata[format];
      return images[images.length - 1];
    }

    const largestUnoptimizedImg = getLargestImage(formats[0]);
    const imgAttributes = stringifyAttributes({
      src: largestUnoptimizedImg.url,
      width: largestUnoptimizedImg.width,
      height: largestUnoptimizedImg.height,
      alt,
      loading: 'lazy',
      decoding: 'async',
    });

    const imgHtmlString = `<img ${imgAttributes}>`;
    const pictureAttributes = stringifyAttributes({
      class: className,
    });
    const picture = `<picture ${pictureAttributes}>${sourceHtmlString}${imgHtmlString}</picture>`;

    return outdent`${picture}`;
  },

  version: () => String(Date.now()),
}