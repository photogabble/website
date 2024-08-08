export default {
  commit: {
    ref: process.env.COMMIT_REF || null,
    url: process.env.REPOSITORY_URL
  },
  title: "PhotoGabble",
  description: "Blog and general digital garden of the full stack programmer Simon Dann.",
  url: "https://photogabble.co.uk",
  feedUrl: "https://photogabble.co.uk/writing/feed.xml",
  author: {
    name: "Simon Dann",
    email: "simon@photogabble.co.uk"
  },
  specialTags: {
    'type/changelog': {
      title: 'Changelog',
      sidebar_title: 'Release Notes / Changelog',
      permalink: '/changelog/'
    },
    'type/glossary': {
      title: 'Glossary',
      sidebar_title: 'Glossary Terms',
      permalink: '/glossary/',
    },
    'type/essay': {
      title: 'Essays',
      sidebar_title: 'Longform Writing',
      permalink: '/essays/',
    },
    'type/noteworthy': {
      title: 'Noteworthy',
      sidebar_title: 'Noteworthy items',
      permalink: '/noteworthy/',
    },
    'type/tutorial': {
      title: 'Tutorials',
      sidebar_title: 'How-to guides and tutorial series',
      permalink: '/tutorials/',
    },
    'type/thought': {
      title: 'Thoughts',
      sidebar_title: 'Thoughtful Thoughts',
      permalink: '/thoughts/',
    },
    'type/mirror': {
      title: 'Mirrored Code Snippets',
      permalink: '/mirrored/',
    },
    'type/resource': {
      title: 'Resources',
      permalink: '/resources/'
    },
    'resource/bookmark': {
      title: 'Bookmark',
      permalink: '/resources/bookmarks/'
    },
  },
  listGroups: {
    media: {
      title: 'Media',
      description: 'Lists of things I have read, watched or listened to.'
    },
    community: {
      title: 'Small Web Community',
      description: 'Lists of community paraphernalia related to the Small Web'
    },
    collection: {
      title: 'Collections'
    },
  },
}
