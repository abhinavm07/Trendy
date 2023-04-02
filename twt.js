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
  console.log();
  const userFollowers = await client.v2.followers(`${userId}`);
  const userFollowing = await client.v2.following(`${userId}`);
  const userTweets = await client.v2.userTimeline(`${userId}`, {
    exclude: "replies",
  });

  // console.log(userFollowers, userFollowing); // true
};
//that number in the parenthesis is woeid
const usersV1 = async () => {
  const trendsOfNy = await client.v1.trendsByPlace(12903);

  for (const { trends, created_at } of trendsOfNy) {
    for (const trend of trends) {
      console.log("Trend", trend.name, "created at", created_at);
    }
  }
};

// Trends of New York

users();

usersV1();
