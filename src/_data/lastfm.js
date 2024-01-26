const fetch = require("node-fetch");
const ObjectCache = require("../../lib/helpers/cache");
const chalk = require("chalk");
const fs = require("node:fs");
const crypto = require("node:crypto");

const key = process.env.LAST_FM_KEY;
const username = 'carbontwelve';
const cache = new ObjectCache(`last-fm`);

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

module.exports = async function () {
  const recentTracks = key ? (await getRecentTracks()) : [];
  const topTracks = key ? (await getTopTracks()) : [];

  return {
    recentTracks,
    topTracks,
  }
};