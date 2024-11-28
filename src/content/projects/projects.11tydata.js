import EleventyFetch from '@11ty/eleventy-fetch';
import {DateTime} from "luxon";

export default {
  layout: "layouts/page-post.njk",
  contentType: 'project',
  permalinkBase: 'projects',
  sidebar_component: 'projects',
  tags: ['type/project'],
  language: null,
  status: null,
  show_related: false,
  folder: ['project'],
  eleventyComputed: {
    permalink(data) {
      return `projects/${this.slugify(data.title)}/`
    },
    async lastCommitDate(data) {
      if (!data.git) return;
      const parts = data.git.split('/');

      const last = parts.splice(-2, 2);
      if (last.length !== 2) return;

      try {
        const branches = await EleventyFetch(
          `https://api.github.com/repos/${last.join('/')}/branches`, {
            duration: '7d',
            type: 'json',
          }
        );

        let lastCommitUrl;

        for (const branch of branches) {
          if (['master', 'main'].includes(branch.name)) {
            lastCommitUrl = branch.commit.url;
            break;
          }
        }

        if (!lastCommitUrl) return;

        const lastCommit = await EleventyFetch(
          lastCommitUrl, {
            duration: '1d',
            type: 'json',
          }
        );

        const date = lastCommit?.commit?.author?.date ?? undefined;
        if (!date) return;
        return DateTime.fromISO(date);
      } catch (e) { /* Most likely a 404 */ }
    }
  }
};
