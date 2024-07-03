const movies = [

  // {
  //   title: '',
  //   year: 2023,
  //   watchedDate: '2023-03-17',
  //   reWatch: false,
  //   review: '',
  //   rating: 5,
  //   imdb: ''
  // },

  {
    title: 'The Gentlemen',
    year: 2019,
    watchedDate: '2023-03-06',
    reWatch: false,
    review: 'Excellent beginning, middle and end',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt8367814/'
  },

  {
    title: 'Lockwood & Co.',
    year: 2023,
    watchedDate: '2023-02-09',
    reWatch: false,
    review: 'This series makes me want to read the books',
    rating: 5,
    imdb: 'https://www.imdb.com/title/tt13802576/'
  },

  {
    title: 'The Sandman: Season 1',
    year: 2022,
    watchedDate: '2023-02-06',
    reWatch: false,
    review: 'Episode six will get sand in your eyes',
    rating: 5,
    imdb: 'https://www.imdb.com/title/tt1751634/'
  },

  {
    title: 'Enola Holmes 2',
    year: 2023,
    watchedDate: '2023-02-03',
    reWatch: false,
    review: 'It had me in the second half',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt14641788/'
  },

  {
    title: 'Slumberland',
    year: 2022,
    watchedDate: '2022-11-28',
    reWatch: false,
    review: "I'll meet you in my dreams",
    rating: 3,
    imdb: 'https://www.imdb.com/title/tt13320662/',
  },

  {
    title: 'Wednesday: Season 1',
    year: 2022,
    watchedDate: '2022-11-26',
    reWatch: false,
    review: "I would loved to see what they could have done with an 18 rating",
    rating: 5,
    imdb: 'https://www.imdb.com/title/tt13443470/',
  },

  {
    title: 'War Dogs',
    year: 2016,
    watchedDate: '2022-05-12',
    reWatch: false,
    review: "I didn't not like this film, just was not what I was expecting",
    rating: 1.5,
    imdb: 'https://www.imdb.com/title/tt2005151/'
  },

  {
    title: 'Battleship',
    year: 2012,
    watchedDate: '2022-03-12',
    reWatch: false,
    review: 'Unrealistic, gratuitous fun',
    rating: 3,
    imdb: 'https://www.imdb.com/title/tt1440129/'
  },

  {
    title: 'Space Sweepers',
    year: 2021,
    watchedDate: '2021-02-07',
    reWatch: false,
    review: 'Absolutely in love with this films aesthetic',
    rating: 5,
    imdb: 'https://www.imdb.com/title/tt12838766/'
  },

  {
    title: 'The Addams Family',
    year: 2019,
    watchedDate: '2021-02-10',
    reWatch: false,
    review: 'A fresh take on an old franchise, I was excited for this and it did not let me down',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt1620981/'
  },

  {
    title: 'Enola Holmes',
    year: 2020,
    watchedDate: '2020-09-22',
    reWatch: false,
    review: 'Much more than just a female Sherlock Holmes',
    rating: 5,
    imdb: 'https://www.imdb.com/title/tt7846844/'
  },

  {
    title: 'Blade Runner 2049',
    year: 2017,
    watchedDate: '2019-12-07',
    reWatch: false,
    review: 'Harrison Ford has aged like a fine wine',
    rating: 5,
    imdb: 'https://www.imdb.com/title/tt1856101/'
  },

  {
    title: 'Serenity',
    year: 2005,
    watchedDate: '2019-10-09',
    reWatch: false,
    review: 'I am a leaf on the wind',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt0379786/'
  },

  {
    title: 'Deadpool 2',
    year: 2018,
    watchedDate: '2023-04-28',
    reWatch: false,
    review: 'A good guy in red',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt5463162/'
  },

  {
    title: 'Extraction',
    year: 2020,
    watchedDate: '2023-05-02',
    reWatch: false,
    review: 'Angry Thor is angry',
    rating: 3.5,
    imdb: 'https://www.imdb.com/title/tt8936646/'
  },

  {
    title: '13 Hours: The Secret Soldiers of Benghazi',
    year: 2016,
    watchedDate: '2023-05-03',
    reWatch: false,
    review: 'I liked this more than I expected to',
    rating: 3,
    imdb: 'https://www.imdb.com/title/tt4172430/'
  },

  {
    title: 'Extraction II',
    year: 2023,
    watchedDate: '2023-07-10',
    reWatch: false,
    review: 'Silly, predictable yet entertaining',
    rating: 3.5,
    imdb: 'https://www.imdb.com/title/tt12263384/'
  },

  {
    title: 'A Fistful of Dollars',
    year: 1964,
    watchedDate: '2023-07-12',
    reWatch: false,
    review: 'Thee pioneering Western',
    rating: 3,
    imdb: 'https://www.imdb.com/title/tt0058461/'
  },

  {
    title: 'For a Few Dollars More',
    year: 1965,
    watchedDate: '2023-07-12',
    reWatch: false,
    review: 'A time when life was cheap',
    rating: 3,
    imdb: 'https://www.imdb.com/title/tt0059578/'
  },

  {
    title: 'The Good, the Bad and the Ugly',
    year: 1966,
    watchedDate: '2023-03-14',
    reWatch: false,
    review: 'The way back to town is only 70 miles...',
    rating: 3,
    imdb: 'https://www.imdb.com/title/tt0060196/'
  },

  {
    title: 'The Magnificent Seven',
    year: 2016,
    watchedDate: '2023-08-06',
    reWatch: false,
    review: 'Righteous vengeance',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt2404435/'
  },

  {
    title: 'The Mother',
    year: 2023,
    watchedDate: '2023-07-30',
    reWatch: false,
    review: '',
    rating: 3.5,
    imdb: 'https://www.imdb.com/title/tt6968614/'
  },

  {
    title: 'Gods of Egypt',
    year: 2016,
    watchedDate: '2023-12-19',
    reWatch: false,
    review: 'I am a man of many talents',
    rating: 4,
    imdb: 'https://www.imdb.com/title/tt2404233/'
  },

  // {
  //   title: 'Everything Everywhere All at Once',
  //   year: 2022,
  //   watchedDate: '2023-03-17',
  //   reWatch: false,
  //   review: '',
  //   rating: 5,
  //   imdb: 'https://www.imdb.com/title/tt6710474/'
  // },

  // {
  //   title: '',
  //   year: 2023,
  //   watchedDate: '2023-03-17',
  //   reWatch: false,
  //   review: '',
  //   rating: 5,
  //   imdb: ''
  // },
];

export default movies.map(movie => {
  return {...movie, watchedDate: new Date(Date.parse(movie.watchedDate))};
}) .sort((a, b) => {
  return b.watchedDate - a.watchedDate;
})
