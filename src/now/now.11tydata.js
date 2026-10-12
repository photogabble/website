import {dateToFormat} from "../../lib/filters.js";

export default {
  draft: false,
  layout: "layouts/page-now.njk",
  tags: ['now'],
  tint: 'sage',
  eleventyComputed: {
    title: (data) => `/now ${dateToFormat(data.page.date, 'LLLL yyyy')} update`,
  }
}
