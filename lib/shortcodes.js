import markdown from './helpers/markdown.js';
import Image from '@11ty/eleventy-img';
import outdent from 'outdent';
import {stringifyAttributes} from './helpers/stringify-attributes.js';
import {firstBtn} from "./filters.js";

/**
 * @see https://gist.github.com/dirtystylus/d488ea82fec9ebda8308a288015d019b
 * @param {string} src image source
 * @param {string} caption figcaption
 * @param {string} alt image alt text
 * @param {string} className image class list
 * @returns {string} HTML
 */
export const figure = async (src, caption, alt, className) => {
  const classMarkup = className ? ` class="${className}"` : '';
  const captionMarkup = (caption && caption.length > 0) ? `<figcaption>${markdown().renderInline(caption.trim())}</figcaption>` : '';

  const imgMarkup = await image(src, alt);
  return `<figure${classMarkup}>${imgMarkup}${captionMarkup}</figure>`;
};

// TODO: Update this to wrap the blockquote in a figure
export const blockquote = (content, cite, via, url) => {
  let footer = '';

  if (cite) footer += `<footer>— <cite>${cite}</cite>`;
  if (via) footer += ' | ' + ((url)
    ? `<a href=${url}>${via}</a>`
    : via);
  if (footer !== '') footer += '</footer>';

  return `<blockquote>${markdown().render(content)}${footer}</blockquote>`
}

/**
 * Usage {% image ... %}
 * @param src
 * @param alt
 * @param className
 * @param widths
 * @param formats
 * @param sizes
 * @return {Promise<string>}
 */
export const image = async (src, alt, className = undefined, widths = [400, 800, 1280], formats = ['webp', 'jpeg'], sizes = '100vw') => {
  if (!src.startsWith('public')) {
    // This looks up files from the project root, I store all public images in /public/img
    // if src does not start with public, prefix it so we don't get any silly no such file
    // or directory errors.

    src = `public${src.startsWith('/') ? '' : '/'}${src}`;
  }

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

/**
 * The format for a conversation is as follows:
 *
 * > a: Person A is saying these words
 * > b: Person B is saying these words
 * > Person B is also saying these words
 *
 * The conversation always begins with person A unless set by the `b:` prefix. Any lines that do not begin with a `>`
 * will be ignored.
 *
 * @param {string} content
 * @return {string}
 */
export const conversation = (content) => {
  const {lines} = [...content.trim().matchAll(/> (([ab]:) (.+)|(.+))/gm)]
    .reduce((carry, match) => {
      // match[2] is the voice (either a: or b:)
      // match[3] contains the line if voice is set else match[4]
      if (typeof match[2] !== 'undefined') carry.voice = match[2];
      const line = (typeof match[2] === 'undefined')
        ? match[4]
        : match[3];

      const classList= carry.voice === 'a:'
        ? ['from-me']
        : ['from-them'];

      carry.lines.push({
        classList,
        voice: carry.voice,
        line: markdown().renderInline(line).trim(),
      });

      return carry;
    }, {lines: [], voice: 'a:'});

  for (let i = 0; i < lines.length; i++) {
    const pLine = lines[i-1] ?? undefined;
    const line = lines[i];

    if (typeof pLine === 'undefined') continue;

    if (pLine.voice === line.voice) {
      // If the previous line has the same voice as this line, remove its tail. Only the last
      // message by the same voice has a tail.
      pLine.classList.push('no-tail');
    }
  }

  const innerHtml = lines.map(({line, classList}) => {
    return `<p class="${classList.join(' ')}">${line}</p>`
  }).join(' ');

  return `<figure class="conversation">${innerHtml}</figure>`;
};

export const registerShortcodes = (eleventyConfig) => {
  eleventyConfig.addAsyncShortcode('figure', figure);
  eleventyConfig.addAsyncShortcode('image', image);
  eleventyConfig.addPairedShortcode('blockquote', blockquote);
  eleventyConfig.addPairedShortcode('conversation', conversation);
  eleventyConfig.addShortcode('buttonBoard', buttonBoard);
};
