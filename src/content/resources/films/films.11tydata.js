import fs from 'node:fs';
import path from 'node:path';
import {ratingToStars} from "../../../../lib/filters.js";

export default {
  tags: ['resource/film'],
  sidebar_resource: 'resource/film',
  eleventyComputed: {
    sub_title(data) {
      const spacer = data.review ? ' — ' : '';
      if (data.rating) return `${data.review}${spacer}${ratingToStars(data.rating)}`;
      return data.review;
    },
    cover(data) {
      const imgPathname = path.join(process.cwd(), 'public/img/films/covers', `${data.page.fileSlug}.jpg`);

      return fs.existsSync(imgPathname)
        ? `/img/films/covers/${data.page.fileSlug}.jpg`
        : undefined;
    },
  }
}
