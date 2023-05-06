const express = require("express");
const app = express();
const { TwitterApi } = require("twitter-api-v2");
require("dotenv/config");

const trendStatic = require("../model/trendStatic");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const { tweetsSentiment } = require("../controllers/sentimentAnalysis");

const getSentiment = tweetsSentiment;

const v1Client = client.v1;
const trendsV1 = async (req, res) => {
  const id = req.body.woeid;
  const { trendID } = req.body;
  let trendsOfNy = [];
  let trendStaticData;
  try {
    if (!trendID) {
      trendsOfNy = await v1Client.trendsByPlace(Number(id));
      trendStaticData = await trendStatic.create({
        data: trendsOfNy,
      });
    } else {
      const trendStaticExists = await trendStatic.findById({ _id: trendID });
      trendsOfNy = trendStaticExists["data"];
    }

    let trendColec = [];

    for (const { trends, created_at } of trendsOfNy) {
      for (const trend of trends) {
        if (trend.tweet_volume) {
          trendColec.push({
            trend: trend.name,
            created_at: created_at,
            tweet_url: trend.url,
            volumn: trend.tweet_volume,
          });
        }
      }
      res.status(200).json(trendColec);
    }
  } catch (error) {
    console.error(error.message);
  }
};

const nearMeT = async (req, res, next) => {
  try {
    let { lat, long } = req.body;
    (lat = Number(lat)), (long = Number(long));
    try {
      const trends = await client.v1.trendsClosest(lat, long);
      const woeid = trends[0]["woeid"];

      const trendsColec = await v1Client.trendsByPlace(Number(woeid));
      let trendColec = [];
      for (const { trends, created_at } of trendsColec) {
        for (const trend of trends) {
          if (trend.tweet_volume) {
            trendColec.push({
              trend: trend.name,
              created_at: created_at,
              volume: trend.tweet_volume,
              tweet_url: trend.url,
            });
          }
        }
        res.status(200).json(trendColec);
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

async function getTrendSentiment(trend) {
  //console.log(trend)
  if (!trend) return "neutral";
  const clientResponse = await client.v2.search(trend, {
    "tweet.fields": "public_metrics",
    sort_order: "relevancy",
  });
  const topTweet = clientResponse?.data?.data[0];
  //if getSentiment(topTweet?.text) is less than 0 negative, 0 is neutral and greater than 0 is positive
  let sentiment = getSentiment(topTweet?.text);

  if (sentiment < 0) {
    return "negative";
  } else if (sentiment === 0) {
    return "neutral";
  } else {
    return "positive";
  }
}

const trendTweets = async (req, res) => {
  let i = 0;
  let tweetColec = [];
  const { search } = req.body;
  const recentTweets = await client.v2.tweetCountRecent(search);

  const searchTweets = await client.v2.search(search, {
    "media.fields": "url",
  });

  // Consume every possible tweet of jsTweets (until rate limit is hit)
  for await (const tweet of searchTweets) {
    i++;
    if (i < 50) {
      tweetColec.push({ tweetID: tweet.id, tweet: tweet.text });
    } else if (i >= 50) {
      console.log(i);
      break;
    }
  }
  console.log(i);
  tweetColec.push([`recent tweet count : ${recentTweets.data[0].tweet_count}`]);
  res.json(tweetColec);
};

const trendsCountry = async (req, res) => {
  let availableTrends = [];
  const currentTrends = await client.v1.trendsAvailable();
  let len = Object.keys(currentTrends).length;
  for (const { name, country, woeid } of currentTrends) {
    availableTrends.push({ name: name, country: country, woeid: woeid });
  }
  res.json(availableTrends);
};

module.exports = {
  trendsV1,
  nearMeT,
  trendTweets,
  trendsAvailable: trendsCountry,
  getTrendSentiment,
};
