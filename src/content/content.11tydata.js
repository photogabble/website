import {dateToFormat, notTagged, specialTagValue} from "../../lib/filters.js";
//import {getChanges} from '../../lib/helpers/get-git-changes';

export default {
  show_related: true,
  show_prev_next: true,
  featured: false,
  draft: false,
  excludeFromFeed: false,
  tags: [],
  layout: 'layouts/page-post.njk',
  // TODO: (RC2024) remove growthStage and contentType
  growthStage: 'seedling', // seedling, budding, evergreen
  contentType: 'thought', // thought, noteworthy, essay, tutorial, project

  eleventyComputed: {
    //changes: data => getChanges(data),
    // niceDate: stops dateToFormat being hit hundreds of thousands of times
    niceDate: data => dateToFormat(data.page.date, 'DDD'),
    permalink(data) {
      const path = data?.permalinkBase ?? data.contentType;
      const slug = data?.slug ?? this.slugify(data.title);
      return `${path}/${slug}/`;
    },
    // TODO: special consideration for previous/next of `type/topic`
    // TODO: filter out stubs
    previousPost(data) {
      const type = specialTagValue(data.tags, 'type');
      const collection = data?.collections[`type/${type}`] ?? [];
      if (collection.length === 0) return undefined;

      const idx = collection.findIndex((item) => item.inputPath === data.page.inputPath);
      if (idx < 1) return undefined;

      return collection[idx - 1];
    },
    nextPost(data) {
      const type = specialTagValue(data.tags, 'type');
      const collection = data?.collections[`type/${type}`] ?? [];
      if (collection.length === 0) return undefined;

      const idx = collection.findIndex((item) => item.inputPath === data.page.inputPath);
      if (idx === collection.length - 1) return undefined;

      return collection[idx + 1];
    },
    related(data) {
      const tags = data.tags;
      const items = notTagged((data?.collections.writing ?? []), 'stage/stub');
      if (items.length === 0) return [];

      // loop over all files tagged as `writing` and create a list of files
      // related to this one based upon similar tags.

      return items.reduce((carry, item) => {
        if (item.inputPath === data.page.inputPath) return carry;
        if ((item.data?.tags ?? []).length === 0) return carry;

        const score = item.data.tags
          .map(tag => tags.includes(tag) ? 1 : 0)
          .reduce((count, current) => {
            count += current;
            return count;
          });

        if (score === 0) return carry;

        carry.push({
          score,
          page: item,
        });

        return carry;
      }, []).sort((a, b) => {
        // TODO: if score is equal, sort by last modified
        return b.score - a.score; // DESC order of score
      }).map(item => item.page);
    },
  }
};
