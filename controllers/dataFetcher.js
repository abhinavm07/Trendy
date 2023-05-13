const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);
const fs = require("fs");
const path = require("path");
const { CACHE_TTL, CACHE_ENABLED = false } = process.env;
const crypto = require("crypto");

/**
 * Fetches data from twitter api
 * @param apiVersion
 * @param endPoint
 * @param body
 * @param options
 * @returns {Promise<[]|Buffer|*|string>}
 */
async function twitterClient(
  apiVersion = "v2",
  endPoint = "",
  body,
  options = {}
) {
  if (!endPoint) return "No endpoint specified.";
  const version = apiVersion == "v2" ? client.v2 : client.v1;
  const hashFunc = crypto.createHash("sha256");
  hashFunc.update(`${apiVersion}_${endPoint}_${body}`);
  const finalHash = hashFunc.digest("hex");

  const cacheName = `${finalHash}.json`;

  if (CACHE_ENABLED) {
    const cache = fetchCache(cacheName);
    if (cache) {
      return cache;
    }
  }
  const response = await version[endPoint](body, options);
  if (CACHE_ENABLED) {
    saveCache(cacheName, response);
  }
  return response;
}

/**
 * fetches cache
 * @param cacheName
 * @returns {boolean}
 */
function fetchCache(cacheName) {
  const hasCache = checkCacheFolder(cacheName);
  if (!hasCache) return false;
  const cacheFile = path.join(__dirname, `../cache/${cacheName}`);
  const cache = fs.readFileSync(cacheFile);
  return JSON.parse(cache.toString());
}

/**
 * checks if cache folder exists
 * @param cacheName
 * @returns {boolean}
 */
function checkCacheFolder(cacheName) {
  const cacheFolderPath = path.join(__dirname, "../cache"); // define the path to the cache folder
  const cacheFile = path.join(__dirname, `../cache/${cacheName}`);
  if (!fs.existsSync(cacheFolderPath)) {
    fs.mkdirSync(cacheFolderPath);
    console.log("Cache folder created successfully");
    return false;
  }

  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, JSON.stringify([]));
    return false;
  }

  //if file content is [] return false
  const cache = fs.readFileSync(cacheFile);
  if (cache.toString() === "[]") {
    return false;
  }
  //get created time of file
  const { birthtime } = fs.statSync(cacheFile);
  const now = new Date();
  const diff = now - birthtime;
  const diffInHours = diff / (1000 * 60 * 60);
  if (diffInHours > CACHE_TTL) {
    console.log(`Cache expired ${cacheName}`);
    fs.unlinkSync(cacheFile);

    return false;
  }

  return true;
}

/**
 * saves cache
 * @param cacheName
 * @param response
 */
function saveCache(cacheName, response) {
  const cacheFile = path.join(__dirname, `../cache/${cacheName}`);
  fs.writeFileSync(cacheFile, JSON.stringify(response));
  console.log(`Cache saved successfully ${cacheName}`);
}

module.exports = twitterClient;
