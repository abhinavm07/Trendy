const { TwitterApi } = require("twitter-api-v2");
require("dotenv/config");

const twitterClient = require("./dataFetcher");

const staticAPI = require("../model/staticAPIdata");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const trackingSchema = require("../model/trackUserSchema");

const { userTracking } = require("../controllers/userTracking");
const { logger } = require("./autoUserTracker");

const { tweetsSentiment } = require("../controllers/sentimentAnalysis");

const { tweetContext, contextVol } = require("../controllers/tweetContexts");

const getTwtData = async (req, res) => {
  const { twtUsername, staticID, trackUser, sysUsername } = req.body;
  let tweetsColec = [];
  let userAnnotes = [];
  let user;
  let staticData;
  let userTweets;
  // const updateData = logger(sysUsername);

  // const user = await twitterClient("v2", "userByUsername", twtUsername, {
  //   "user.fields": "public_metrics",
  // });

  if (staticID) {
    staticData = await staticAPI.findById({ _id: staticID });
    user = staticData["data"];
  } else {
    user = await client.v2.userByUsername(`${twtUsername}`, {
      "user.fields": "public_metrics",
    });
  }

  const userId = user?.data?.id || null;
  if (userId) {
    if (staticID) {
      userTweets = staticData["userTweets"];
    } else {
      userTweets = await client.v2.userTimeline(`${userId}`, {
        exclude: "retweets,replies",
        "tweet.fields": "context_annotations",
      });
    }

    if (userTweets) {
      if (!staticID) {
        // const staticSearch = await staticAPI.findOne({
        //   data: user,
        //   userTweets: userTweets,
        // });
        // if (!staticSearch) {
        staticData = await staticAPI.create({
          data: user,
          userTweets: userTweets,
        });
        // }
      }
      //
      let twtData = userTweets["_realData"]["data"];
      for (const twt of twtData) {
        const id = twt["id"];
        const twtSentiment = await tweetsSentiment(twt["text"]);
        const annotations = twt["context_annotations"];
        if (annotations) {
          const context = tweetContext(annotations, id);
          userAnnotes.push(context[id]);
          tweetsColec.push({
            id: twt["id"],
            tweet: twt["text"],
            sentiment: twtSentiment,
            context: context[id],
          });
        } else {
          tweetsColec.push({
            id: twt["id"],
            tweet: twt["text"],
            sentiment: twtSentiment,
          });
        }
      }
      const contextVolume = await contextVol(userAnnotes.flat());
      if (trackUser) {
        userTracking(user, sysUsername, tweetsColec);
      }
      return res.status(200).json({
        userData: user,
        twtData: tweetsColec,
        contextVolume: contextVolume,
      });
    }
    return res
      .status(404)
      .send(
        "User account is not public, please search for a user with public tweets."
      );
  }
  return res.status(404).send("User not found with the given username.");
};

const searchTwt = async (req, res) => {
  let i = 0;
  let tweetsColec = [];
  const { search } = req.body;
  const recentTweets = await client.v2.tweetCountRecent(search);

  const searchTweets = await client.v2.search(search, {
    "media.fields": "url",
  });

  // Consume every possible tweet of jsTweets (until rate limit is hit)
  for await (const tweet of searchTweets) {
    i++;
    if (i < 20) {
      tweetsColec.push([tweet.id, tweet.text]);
    } else if (i >= 20) {
      break;
    }
  }
  tweetsColec.push([
    `recent tweet count : ${recentTweets.data[0].tweet_count}`,
  ]);
  res.json(tweetsColec);
};

module.exports = {
  getTwtData,
  searchTwt,
};
