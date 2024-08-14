import {movies} from '../src/_data/movies.js';
import {slugify} from "../lib/filters.js";
import path from 'path'
import yaml from 'js-yaml';
import fs from 'fs';

for (const movie of movies) {
  const filename = `${movie.watchedDate}-${slugify(movie.title)}.md`;
  const data = yaml.dump({
    title: `${movie.title} (${movie.year})`,
    year: movie.year,
    review: movie.review,
    rating: movie.rating,
    imdb: movie.imdb,
    tags: ['list/watched'],
  });

  fs.writeFileSync(
    path.join(process.cwd(),`/src/content/resources/films/${filename}`),
    `---\n${data}---\n`
  );
}
