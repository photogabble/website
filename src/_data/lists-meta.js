//
// This file provides titles and descriptions for
// my collection of lists. This data is consumed
// by the lists collection for each list in use.
//
module.exports = {

  // Collections of things

  'list/blogroll': {
    title: 'Blogroll',
    prefix: 'Community',
    description: 'Hand curated list of websites and blogs I find interesting',
  },

  'list/webring': {
    title: 'Webrings',
    description: 'The OG method of discovering interesting websites',
  },

  'list/www-club': {
    title: 'WWW Clubs',
    description: 'List of clubs that group together websites under a single banner',
  },

  'list/e-magazine': {
    title: 'Online Magazines',
    description: 'List of digital magazines that interest me',
  },


  'list/button-board': {
    title: 'Button Board',
    prefix: 'Community',
    description: 'Like a blogroll but via the medium of 88x21 gifs',
    layout: 'layouts/list-button-board.njk',
    permalink: '/button-board/',
  },

  'list/digital-garden': {
    title: 'Digital Gardens',
    description: 'List of digital gardens',
  },

  'list/inspiration': {
    title: 'Inspiration',
    description: 'Websites and People who have inspired me',
  },

  'list/games': {
    title: 'My Games Library',
    description: 'List of games that I would like to one day play',
  },

  'list/youtube-channel': {
    title: 'YouTube Channels',
    description: 'List of channels I enjoy watching',
  },

  'list/forum': {
    title: 'Forums',
    description: 'List of Forums'
  },

  // Continuous Writing Projects

  'list/week-in-review': {
    title: 'Week In Review',
    description: 'Weekly round up of that weeks events',
  },

  'list/365-writing': {
    title: '365 day writing project',
    description: 'My attempt at writing a thought a day for a year',
    layout: 'layouts/list-posts.njk',
  },
};