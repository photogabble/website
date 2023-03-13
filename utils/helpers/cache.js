const path = require("path");
const flatCache = require("flat-cache");
const {createHash} = require("crypto");

/**
 * A vastly paired down version of AssetCache from eleventy-fetch
 * @see https://github.com/11ty/eleventy-fetch/blob/master/src/AssetCache.js
 */
class ObjectCache {
  hash;
  filenamePrefix;
  cacheDirectory;
  forever = 86400*365*10; // Ten years is forever in technology

  /**
   * @param uniqueKey {string}
   * @param cacheDirectory {string}
   * @param hashLength {number}
   * @param filenamePrefix
   */
  constructor(
    uniqueKey,
    cacheDirectory = ".cache",
    hashLength = 30,
    filenamePrefix = 'photogabble-cache'
  ) {
    this.hash = ObjectCache.getHash(uniqueKey, hashLength);
    this.cacheDirectory = cacheDirectory;
    this.filenamePrefix = filenamePrefix;

    // TODO: check this.cachePath is writable

    this.cache = flatCache.load(this.cacheFilename, this.rootDir);
  }

  /**
   * @param key {string}
   * @param hashLength {number}
   * @returns {string}
   */
  static getHash(key, hashLength = 30) {
    let hash = createHash("sha256");
    hash.update(key);
    return ("" + hash.digest('hex')).substring(0, hashLength);
  }

  /**
   * Returns the root directory
   *
   * Work in an AWS Lambda (serverless)
   * https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
   *
   * @returns {string}
   */
  get rootDir() {
    // Bad: LAMBDA_TASK_ROOT is /var/task/ on AWS so we must use ELEVENTY_ROOT
    // When using ELEVENTY_ROOT, cacheDirectory must be relative
    // (we are bundling the cache files into the serverless function)
    if (process.env.LAMBDA_TASK_ROOT && process.env.ELEVENTY_ROOT && !this.cacheDirectory.startsWith("/")) {
      return path.resolve(process.env.ELEVENTY_ROOT, this.cacheDirectory);
    }

    // otherwise, it is recommended to use somewhere in /tmp/ for serverless (otherwise it won’t write)
    return path.resolve(this.cacheDirectory);
  }

  get cacheFilename() {
    return `${this.filenamePrefix}-${this.hash}`;
  }

  get cachePath() {
    return path.join(this.rootDir, this.cacheFilename);
  }

  /**
   *
   * @param key {string}
   * @return {*|undefined}
   */
  get(key) {
    const found = this.cache.getKey(key);
    if (!found) return undefined;
    const ttl = Math.floor(found.ttl - (Date.now() / 1000));
    if (ttl <= 0) return undefined;
    return found.data;
  }

  /**
   * @param key {string}
   * @param data {*}
   * @param ttl {number} defaults to one day
   */
  set(key, data, ttl = 86400) {
    this.cache.setKey(key, {
      ttl: Math.floor((Date.now() / 1000) + ttl),
      data,
    });

    this.cache.save(true);
  }

  /**
   * @param key {string}
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }
}

module.exports = ObjectCache;