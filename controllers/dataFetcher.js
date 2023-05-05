const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);
const fs = require("fs");
const path = require("path");

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
  const cache = fetchCache(apiVersion, endPoint);

  if (cache.length > 0) {
    return cache;
  }

  const version = apiVersion == "v2" ? client.v2 : client.v1;

  const response = await version[endPoint](body, options);
  saveCache(version, endPoint, response);
  return response;
}

/**
 * fetches cache
 * @param version
 * @param endPoint
 * @returns {Buffer|*[]}
 */
function fetchCache(version, endPoint) {
  console.log("fetching cache", version);
  const hasCache = checkCacheFolder(version, endPoint);
  if (!hasCache) return [];
  const cacheFile = path.join(__dirname, `${version}_${endPoint}.json`);
  const cache = fs.readFileSync(cacheFile);
  return cache;
}

/**
 * checks if cache folder exists
 * @param version
 * @param endPoint
 * @returns {boolean}
 */
function checkCacheFolder(version, endPoint) {
  console.log("checking cache folder");
  const cacheFolderPath = path.join(__dirname, "cache"); // define the path to the cache folder
  const cacheFile = path.join(__dirname, `${version}_${endPoint}.json`);
  console.log(cacheFolderPath);
  if (!fs.existsSync(cacheFolderPath)) {
    fs.mkdirSync(cacheFolderPath);
    console.log("Cache folder created successfully");
    return false;
  }

  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, { recursive: true });
    return false;
  }
  return true;
}

/**
 * saves cache
 * @param version
 * @param endPoint
 * @param response
 */
function saveCache(version, endPoint, response) {
  console.log("response ", response);
  const cacheFile = path.join(__dirname, `cache/${version}_${endPoint}.json`);
  fs.writeFileSync(cacheFile, JSON.stringify(response));
  console.log(`Cache saved successfully ${version}_${endPoint}`);
}

module.exports = twitterClient;
