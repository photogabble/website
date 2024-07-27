import markdown from './helpers/markdown.js';
import Image from '@11ty/eleventy-img';
import outdent from 'outdent';
import {stringifyAttributes} from './helpers/stringify-attributes.js';
import {firstBtn} from "./filters.js";

/**
 * @see https://gist.github.com/dirtystylus/d488ea82fec9ebda8308a288015d019b
 * @param {string} image
 * @param {string} caption
 * @param {string} alt
 * @param {string} className
 * @returns {string}
 */
export const figure = (image, caption, alt, className) => {
  const classMarkup = className ? ` class="${className}"` : '';
  const captionMarkup = caption ? `<figcaption>${markdown().render(caption)}</figcaption>` : '';
  const imgMarkup = alt ? `<img src="${image}" alt="${alt}" />` : `<img src="${image}" />`;
  return `<figure${classMarkup}>${imgMarkup}${captionMarkup}</figure>`;
};

export const blockquote = (content, cite, via, url) => {
  let footer = '';

  if (cite) footer += `<footer>— <cite>${cite}</cite>`;
  if (via) footer += ' | ' + ((url)
    ? `<a href=${url}>${via}</a>`
    : via);
  if (footer !== '') footer += '</footer>';

  return `<blockquote>${markdown().render(content)}${footer}</blockquote>`
}

export const image = async (src, alt, className = undefined, widths = [400, 800, 1280], formats = ['webp', 'jpeg'], sizes = '100vw') => {
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
  }

export const version = () => String(Date.now());

/**
 * Formats pages that contain button front matter into a list of links
 * using the first button in the pages list.
 *
 * @param {Array<any>} items
 * @return {string}
 */
export const buttonBoard = (items) => {
  let html = '';

  for (const item of items) {
    if (!item.data.button) continue;

    const href = item.data.dead
      ? item.url
      : item.data?.cite?.href ?? item.url;
    const title = item.data.title;
    const button = `/img/88x31/${firstBtn(item.data.button)}`;
    html += `<a href="${href}" class="no-ext btn-88x31" rel="noopener" title="Visit ${title}"><img width="88" height="31" src="${button}" alt="88x31 button for ${title}" aria-hidden="true"/></a>`;
  }

  return `<nav class="button-board">${html}</nav>`;
}

export const registerShortcodes = (eleventyConfig) => {
  eleventyConfig.addShortcode('figure', figure);
  eleventyConfig.addAsyncShortcode('image', async () => 'TODO');
  eleventyConfig.addPairedShortcode('blockquote', blockquote);
  eleventyConfig.addShortcode('buttonBoard', buttonBoard);
};
