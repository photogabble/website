const ObjectCache = require("../../lib/helpers/cache");
const chalk = require("chalk");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const {finished} = require("node:stream/promises");
const {Readable} = require("node:stream");
const {strToSlug} = require("../../lib/helpers");

const key = process.env.LAST_FM_KEY;
const username = 'carbontwelve';
const cache = new ObjectCache(`last-fm`);

class ImageDownload {
  constructor(path) {
    if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true});
    this.path = path;
  }

  async save(src, name) {
    if (src === '') throw new Error('Unable to download a file from nowhere!');

    const filename = typeof name === 'undefined'
      ? path.basename(src)
      : `${name}${path.extname(src)}`;
    const pathname = path.join(this.path, filename);

    if (!fs.existsSync(pathname)) {
      const stream = fs.createWriteStream(pathname);
      const {body} = await fetch(src);
      if (body) await finished(Readable.fromWeb(body).pipe(stream));
    }

    return {
      pathname,
      filename,
    }
  }
}

class Lastfm {
  baseUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor(key, username, imgPath) {
    this.key = key;
    this.username = username;
    this.iDownloader = new ImageDownload(imgPath);
  }

  params() {
    return new URLSearchParams(`api_key=${this.key}&username=${this.username}&format=json`);
  }

  async getTopAlbums() {
    if (cache.has('top-albums')) return cache.get('top-albums');

    const params = this.params();
    params.append('method', 'user.gettopalbums');
    params.append('limit', '16');
    params.append('period', '3month');

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data?.topalbums?.album) {
      const albums = await Promise.all(data.topalbums.album.map(async (album) => {

        const id = strToSlug(`${album.artist.name} ${album.name}`);

        const info = album.mbid
          ? await this.getAlbumInfo({mbid: album.mbid})
          : await this.getAlbumInfo({artistName: album.artist.name, albumName: album.name});

        const images = album.image.reduce((carry, image) => {
          carry[image.size] = image['#text'];
          return carry;
        }, {});

        const image = images['large'] && images['large'].length > 0
          ? (await this.iDownloader.save(
            images['large'],
            id,
          )).filename
          : 'default.png';

        // TODO: return releasedate as year (it seems last.fm doesn't always return this ???)

        const tracks = (info?.tracks)
          ? info.tracks.track.map(track => {
              return {
                name: track.name,
                url: track.url,
                duration: track.duration,
              };
            })
          : [];

        return {
          id,
          name: album.name,
          artist: {
            name: album.artist.name,
            url: album.artist.url,
          },
          tracks,
          url: album.url,
          playcount: album.playcount,
          image: `/img/listening/albums/${image}`,
          images,
        }
      }));

      cache.set('top-albums', albums, 86400);
      return albums;
    }

    return [];
  }

  async getAlbumInfo({artistName, albumName, mbid}) {
    if (!mbid && (!artistName || !albumName)) throw new Error ('Artist and Album name required if mbid not provided');

    const hash = mbid
      ? getStringHash(mbid)
      : getStringHash(`${artistName}_${albumName}`);

    const cacheKey = `album-info.${hash}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const params = this.params();
    params.append('method', 'album.getinfo');

    if (mbid) {
      params.append('mbid', mbid);
    } else {
      params.append('artist', artistName);
      params.append('album', artistName);
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();

    cache.set(cacheKey, data.album, 86400);
    return data.album;
  }
}

function getStringHash(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

async function getRecentTracks() {
  if (cache.has('recent-tracks')) return cache.get('recent-tracks');
  console.log(chalk.blue('[@photogabble/last-fm]'), 'Fetching Recent History');

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&limit=25&api_key=${key}&format=json`);
  const data = await response.json();

  if (data?.recenttracks?.track) {
    cache.set('recent-tracks', data?.recenttracks?.track, 600);
    return data?.recenttracks?.track;
  }

  return [];
}

// Because the images last.fm return for a track seem to be for the track itself and therefore often
// unset, we need to obtain the album images.
async function getTrackInfo(artistName, trackName) {
  const hash = getStringHash(`${artistName}_${trackName}`);
  // TODO use hash for caching info
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}&api_key=${key}&format=json`;

  const response = await fetch(url);
  const data = await response.json();
  return data.track;
}

// Get the metadata and tracklist for an album on Last.fm using the album name.
async function getAlbumInfo({artistName, albumName, mbid}) {
  if (!mbid && (!artistName || !albumName)) throw new Error ('Artist and Album name required if mbid not provided');

  const hash = mbid
    ? getStringHash(mbid)
    : getStringHash(`${artistName}_${albumName}`);
  // TODO use hash for caching info


  const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&username=${username}&api_key=${key}&format=json`;

}

async function getTopTracks() {
  if (cache.has('top-tracks')) return cache.get('top-tracks');
  console.log(chalk.blue('[@photogabble/last-fm]'), 'Fetching Top Tracks');

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&period=3month&limit=25&api_key=${key}&format=json`);
  const data = await response.json();

  if (data?.toptracks?.track) {
    const tracks = await Promise.all(data.toptracks.track.map(async track => {
      const info = await getTrackInfo(track.artist.name, track.name);
      const images = info.album
        ? info.album.image
        : track.image;

      return {
        name: track.name,
        artist: track.artist,
        album: info.album
          ? {
            artist: info.album.artist,
            title: info.album.title,
            url: info.album.url,
          }
          : undefined,
        url: track.url,
        playcount: track.playcount,
        rank: track['@attr'].rank,
        images: images.reduce((carry, image) => {
          carry[image.size] = image['#text'];
          return carry;
        }, {}),
      };
    }));

    cache.set('top-tracks', tracks, 86400);
    return tracks;
  }

  return [];
}

async function getTopAlbums() {
  if (cache.has('top-albums')) return cache.get('top-albums');
  console.log(chalk.blue('[@photogabble/last-fm]'), 'Fetching Top Albums');

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${username}&period=3month&limit=16&api_key=${key}&format=json`);
  const data = await response.json();

  if (data?.topalbums?.album) {
    const d = data.topalbums.album.map((album) => {
      return {
        name: album.name,
        artist: {
          name: album.artist.name,
          url: album.artist.url,
        },
        tracks: [],
        url: album.url,
        playcount: album.playcount,
        images: album.images.reduce((carry, image) => {
          carry[image.size] = image['#text'];
          return carry;
        }, {}),
      }
    });

    return d;
  }

  return [];
}

module.exports = async function () {
  const api = new Lastfm(
    process.env.LAST_FM_KEY,
    'carbontwelve',
    path.resolve(__dirname, '../../public/img/listening/albums'),
  );

  return {
     //topAlbums: await api.getTopAlbums(),
  }
};
