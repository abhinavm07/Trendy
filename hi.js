const express = require("express");
const app = express();
const { TwitterApi } = require("twitter-api-v2");
require("dotenv/config");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_KEY_SECRET;
const accessTokenkey = process.env.ACCESS_TOKEN;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// OAuth 1.0a (User context)
const userClient = new TwitterApi({
  appKey: apiKey,
  appSecret: apiSecret,
  accessToken: accessTokenkey,
  accessSecret: accessTokenSecret,
});

const aposToLexForm = require("apos-to-lex-form");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopword = require("stopword");

const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const v1Client = client.v1;

// const users = async () => {
//   const user = await client.v2.userByUsername("ehhhtyoketa");
//   const userId = user.data.id;
//   // console.log();
//   const userFollowers = await client.v2.followers(`${userId}`);
//   const userFollowing = await client.v2.following(`${userId}`);
//   // const userTweets = await client.v2.userTimeline(`${userId}`, {
//   //   exclude: "replies",
//   // });

//   console.log(userFollowing); // true
// };
// //that number in the parenthesis is woeid
// // const usersV1 = async () => {
// //   const trendsOfNy = await v1Client.trendsByPlace(2295381);
// //   let trendColec = [];
// //   //   console.log("Here");

// //   for (const { trends, created_at } of trendsOfNy) {
// //     for (const trend of trends) {
// //       // console.log("Trend : ", trend.name, "created at", created_at);
// //       trendColec.push([trend.name, created_at]);
// //     }
// //     console.log(trendColec);
// //   }
// // };

// // // // Trends of New York

// // const v2 = async () => {
// //   const currentTrends = await client.v1.trendsAvailable();
// //   const trends = await client.v1.trendsClosest(27.72, 85.33);
// //   console.log(trends);
// // };

// // v2();
// users();

// // usersV1();

// // console.log("Here");

// // const http = require("http");
// // const geoip = require("geoip-lite");

// // const server = http.createServer((req, res) => {
// //   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
// //   const location = geoip.lookup(ip);

// //   res.writeHead(200, { "Content-Type": "text/plain" });
// //   res.write(`Your location: ${JSON.stringify(location)}`);
// //   res.end();
// // });

// // server.listen(3000, () => {
// //   console.log("Server listening on port 3000");
// // });

// // Search for public Tweets across the whole Twitter archive
// // https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/full-archive-search

// const needle = require("needle");

// // The code below sets the bearer token from your environment variables
// // To set environment variables on macOS or Linux, run the export command below from the terminal:
// // export BEARER_TOKEN='YOUR-TOKEN'
// const token = process.env.BEARER_TOKEN;

// const endpointUrl = "https://api.twitter.com/2/tweets/search/all";

// async function getRequest() {
//   // These are the parameters for the API request
//   // specify Tweet IDs to fetch, and any additional fields that are required
//   // by default, only the Tweet ID and text are returned
//   const params = {
//     query: "from:twitterdev -is:retweet",
//     "tweet.fields": "author_id",
//   };

//   const res = await needle("get", endpointUrl, params, {
//     headers: {
//       "User-Agent": "v2FullArchiveJS",
//       authorization: `Bearer ${token}`,
//     },
//   });

//   if (res.body) {
//     return res.body;
//   } else {
//     throw new Error("Unsuccessful request");
//   }
// }

// (async () => {
//   try {
//     // Make request
//     const response = await getRequest();
//     console.dir(response, {
//       depth: null,
//     });
//   } catch (e) {
//     console.log(e);
//     process.exit(-1);
//   }
//   process.exit();
// })();
// const ehBhagwan = async () => {
//   const jack = await client.v2.userByUsername("jack", {
//     "user.fields": "public_metrics",
//   });
//   console.log(jack);
// };

// ehBhagwan();

// const ehBhagwanV2 = async (req, res) => {
//   let { text } = req.body;
//   let myArray;
//   myArray = text.split("/");
//   console.log(myArray[5]);

//   const tweetOfID = await client.v2.singleTweet(myArray[5]);
//   console.log(tweetOfID.data.text);

//   const data = tweetOfID.data.text;

//   console.log("Hello");

//   const sentiment = getSentiment(data);

//   let sentimentRemark;

//   if (sentiment === 1) {
//     sentimentRemark = "Positive";
//     console.log(sentimentRemark);
//   }

//   if (sentiment === 0) {
//     sentimentRemark = "Neutral";
//     console.log(sentimentRemark);
//   }

//   if (sentiment === -1) {
//     sentimentRemark = "Negative";
//     console.log(sentimentRemark);
//   }
// };

// const getSentiment = (data) => {
//   if (!data.trim()) {
//     return 0;
//   }

//   const lexed = aposToLexForm(data)
//     .toLowerCase()
//     .replace(/[^a-zA-Z\s]+/g, "");

//   const tokenized = tokenizer.tokenize(lexed);

//   const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));

//   const stopWordsRemoved = stopword.removeStopwords(fixedSpelling);

//   const analyzed = analyzer.getSentiment(stopWordsRemoved);
//   console.log(stopWordsRemoved);
//   console.log(analyzed);
//   if (analyzed > 0) return 1; // positive
//   if (analyzed === 0) return 0;
//   if (isNaN(analyzed)) return 0;
//   return -1;
// };

// ehBhagwanV2();

// const tori = async () => {
//   const user = await client.v2.userByUsername("ehhhtyoketa");
//   const userId = user.data.id;
//   const userTweets = await client.v2.userTimeline(`${userId}`, {
//     exclude: "replies",
//     "tweet.fields": "context_annotations",
//   });
//   console.log(userTweets);

//   // const data = tweetOfID.data.text;
// };

// tori();

// , {
//     "tweet.fields": "context_annotations",
//   }
