const ColorThief = require('colorthief');
const path = require('node:path');

/**
 * Sourced from Thomas Park's iTunes Expanding Album Effect (2012)
 * @see https://24ways.org/2010/calculating-color-contrast
 * @param color {Array<number>}
 * @return {number}
 */
function getContrastYIQ(color) {
  const r = color[0],
    g = color[1],
    b = color[2];

  return ((r*299)+(g*587)+(b*114))/1000;
}

/**
 * Sourced from Thomas Park's iTunes Expanding Album Effect (2012)
 * @param yiq {number}
 * @return {Array<number>}
 */
function getDefaultColor(yiq){
  return (yiq >= 128) ? [0, 0, 0] : [255, 255, 255];
}

/**
 * Sourced from Thomas Park's iTunes Expanding Album Effect (2012)
 * @see https://thomaspark.co/2012/12/the-itunes-expanding-album-effect-in-css-js/
 * @param color
 * @param palette
 * @return {{primary: Array<number>, secondary: Array<number>}}
 */
function inverseColors(color, palette) {
  const yiq = getContrastYIQ(color);
  let colors = [],
    primary,
    secondary;

  for (let i = 0; i < palette.length; i++) {
    if (Math.abs(getContrastYIQ(palette[i]) - yiq) > 80) {
      colors.push(palette[i]);
    }
  }

  primary = colors[0] ? colors[0] : getDefaultColor(yiq);
  secondary = colors[1] ? colors[1] : getDefaultColor(yiq);

  return {primary, secondary};
}

/**
 * Uses Colour Thief library to return a colour palette generated from
 * an image source.
 * @param src {string}
 * @param numColours {number}
 * @return {Promise<{primary: Array, palette: Array}>}
 */
const imgColours = async (src, numColours = 5) => {
  const img = path.join(process.cwd(), 'public', src);

  const primary = await ColorThief.getColor(img);
  const palette = await ColorThief.getPalette(img, numColours);

  return {
    primary,
    palette,
    inverse: inverseColors(primary, palette),
  }
};

module.exports = {
  imgColours,
}