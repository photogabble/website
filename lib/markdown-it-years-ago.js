/**
 * Expects input as a year and will return the diff between now and given
 * year if it is greater than one year.
 *
 * @param {number} year
 * @return {string}
 */
export const yearsAgo = (year) => {
  year = Number(year);
  if (Number.isNaN(year)) throw new Error('year is not a number');

  const diff = (new Date().getFullYear()) - year;
  return (diff < 1)
    ? ''
    : `<small>(${diff}ya)</small>`;
}

// Matches `{% ya 2021 %}` with optional whitespace, e.g. `{%ya 2020%}`
const pattern = /^\{%-?\s*ya\s+(\d{4})\s*-?%\}/;

/**
 * markdown-it plugin that replaces `{% ya YYYY %}` with the number of years
 * since the given year, mirroring the `ya` shortcode.
 *
 * @param {import('markdown-it')} md
 */
export default (md) => {
  md.inline.ruler.before('text', 'years_ago', (state, silent) => {
    // 0x7B = `{`
    if (state.src.charCodeAt(state.pos) !== 0x7B) return false;

    const match = pattern.exec(state.src.slice(state.pos));
    if (!match) return false;

    if (!silent) {
      const token = state.push('years_ago', '', 0);
      token.meta = {year: Number(match[1])};
    }

    state.pos += match[0].length;
    return true;
  });

  md.renderer.rules.years_ago = (tokens, idx) => yearsAgo(tokens[idx].meta.year);
};
