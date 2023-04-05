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

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const v1Client = client.v1;

const users = async () => {
  const user = await client.v2.userByUsername("_abhinavm");
  const userId = user.data.id;
  // console.log();
  const userFollowers = await client.v2.followers(`${userId}`);
  const userFollowing = await client.v2.following(`${userId}`);
  const userTweets = await client.v2.userTimeline(`${userId}`, {
    exclude: "replies",
  });

  // console.log(userFollowers, userFollowing); // true
};
//that number in the parenthesis is woeid
const usersV1 = async () => {
  const trendsOfNy = await v1Client.trendsByPlace(2295381);
  let trendColec = [];
  //   console.log("Here");

  for (const { trends, created_at } of trendsOfNy) {
    for (const trend of trends) {
      // console.log("Trend : ", trend.name, "created at", created_at);
      trendColec.push([trend.name, created_at]);
    }
    console.log(trendColec);
  }
};

// // // Trends of New York

// const v2 = async () => {
//   const currentTrends = await client.v1.trendsAvailable();
//   const trends = await client.v1.trendsClosest(27.72, 85.33);
//   console.log(trends);
// };

// v2();
// users();

usersV1();

// console.log("Here");

// const http = require("http");
// const geoip = require("geoip-lite");

// const server = http.createServer((req, res) => {
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   const location = geoip.lookup(ip);

//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.write(`Your location: ${JSON.stringify(location)}`);
//   res.end();
// });

// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });
