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

// const users = async (req, res) => {
//   const user = await client.v2.userByUsername("_abhinavm");
//   const userId = user.data.id;
//   // console.log();
//   const userFollowers = await client.v2.followers(`${userId}`);
//   const userFollowing = await client.v2.following(`${userId}`);
//   const userTweets = await client.v2.userTimeline(`${userId}`, {
//     exclude: "replies",
//   });

//   // console.log(userFollowers, userFollowing); // true
// };
//that number in the parenthesis is woeid
const trendsV1 = async (req, res) => {
  const id = req.query.woeid;
  console.log(req.query.woeid);
  const trendsOfNy = await v1Client.trendsByPlace(Number(id));
  let trendColec = [];
  //   console.log("Here");

  try {
    for (const { trends, created_at } of trendsOfNy) {
      for (const trend of trends) {
        // console.log("Trend : ", trend.name, "created at", created_at);
        trendColec.push([trend.name, created_at]);
      }
      res.status(200).json({ trends_data: trendColec });
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const nearMeT = async (req, res, next) => {
  try {
    let { lat, long } = req.query;
    (lat = Number(lat)), (long = Number(long));
    const trends = await client.v1.trendsClosest(lat, long);
    const woeid = trends[0]["woeid"];

    const trendsOfNy = await v1Client.trendsByPlace(Number(woeid));
    let trendColec = [];
    //   console.log("Here");

    try {
      for (const { trends, created_at } of trendsOfNy) {
        for (const trend of trends) {
          // console.log("Trend : ", trend.name, "created at", created_at);
          trendColec.push([trend.name, created_at]);
        }
        res.status(200).json({ trends_data: trendColec });
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { trendsV1, nearMeT };
