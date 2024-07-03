import {dateToFormat} from "../../lib/filters.js";

export default {
  "draft": false,
  "layout": "layouts/now.njk",
  eleventyComputed: {
    title: (data) => (!data?.page?.date)
      ? '/now'
      : `/now ${dateToFormat(data.page.date, 'LLLL yyyy')} update`
  }
}
