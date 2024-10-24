import purgeCSSPlugin from "@fullhuman/postcss-purgecss";
import importPlugin from "postcss-import";
import autoprefixer from "autoprefixer";
import minifyPlugin from "postcss-minify";

let plugins = [
  importPlugin,
  autoprefixer,
];

if (process.env.ELEVENTY_ENV === 'production') {
  // These all take time to process and are best done in production only.
  plugins = [
    ...plugins,
    purgeCSSPlugin({
      content: [
        './**/*.html',
        './**/*.njk',
        './**/*.js',
        './**/*.md',
      ],
      safelist: [
        /^theme-/
      ]
    }),
    minifyPlugin,
  ];
}

export default {
  plugins
};
