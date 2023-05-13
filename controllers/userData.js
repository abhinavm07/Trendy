const { TwitterApi } = require("twitter-api-v2");
require("dotenv/config");
const asyncHandler = require("express-async-handler");

const twitterClient = require("./dataFetcher");

const staticAPI = require("../model/staticAPIdata");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const { userTracking } = require("../controllers/userTracking");
// const { logger } = require("./autoUserTracker");

const { tweetsSentiment } = require("../controllers/sentimentAnalysis");

const {
  tweetContext,
  calculateVolume,
  arrayValue,
} = require("../controllers/tweetContexts");

// const { retriveSysUsers } = require("../controllers/admin");

const { getRecomendations } = require("../controllers/recommendation");

const getTwtData = asyncHandler(async (req, res) => {
  const { twtUsername, staticID, trackUser, sysUsername } = req.body;
  let tweetsColec = [];
  let userAnnotes = [];
  let user;
  let staticData;
  let userTweets;
  let contextReps = [];
  let sentimentArray = [];

  // retriveSysUsers();
  // const updateData = logger(sysUsername);

  // const user = await twitterClient("v2", "userByUsername", twtUsername, {
  //   "user.fields": "public_metrics",
  // });

  if (staticID) {
    staticData = await staticAPI.findById({ _id: staticID });
    user = staticData["data"];
  } else {
    user = await twitterClient("v2", "userByUsername", twtUsername, {
      "user.fields": "public_metrics",
    });
  }

  const userId = user?.data?.id || null;
  if (userId) {
    if (staticID) {
      userTweets = staticData["userTweets"];
    } else {
      userTweets = await twitterClient("v2", "userTimeline", userId, {
        exclude: "retweets,replies",
        "tweet.fields": "context_annotations",
      });
    }

    if (userTweets) {
      if (!staticID) {
        staticData = await staticAPI.create({
          data: user,
          userTweets: userTweets,
        });
      }
      // console.log(userTweets["_realData"]);
      let twtData = userTweets["_realData"]["data"];
      // console.log(twtData);
      for (const twt of twtData) {
        const id = twt["id"];
        const text = twt["text"].replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");
        if (text) {
          const twtSentiment = await tweetsSentiment(text);
          sentimentArray.push(twtSentiment);
          const annotations = twt["context_annotations"];
          if (annotations) {
            const context = tweetContext(annotations, id);
            userAnnotes.push(context[id]);
            tweetsColec.push({
              id: twt["id"],
              tweet: text,
              sentiment: twtSentiment,
              context: context[id],
            });
          } else {
            tweetsColec.push({
              id: twt["id"],
              tweet: text,
              sentiment: twtSentiment,
            });
          }
        } else {
          console.log(twt["text"]);
        }
      }
      const contextVolume = calculateVolume(userAnnotes.flat());
      const sentimentVolume = calculateVolume(sentimentArray.flat());
      const contextValues = arrayValue(contextVolume);
      // const recommendations = await getRecomendations(
      //   contextValues,
      //   user.data.username
      // );
      // console.log(recommendations);

      if (trackUser) {
        userTracking(user, sysUsername, tweetsColec);
      }
      return res.status(200).json({
        userData: user,
        twtData: tweetsColec,
        contextVolume: contextVolume,
        sentimentVolume: sentimentVolume,
        contextValues: contextValues,
      });
    }
    return res
      .status(404)
      .send(
        "User account is not public, please search for a user with public tweets."
      );
  }
  return res.status(404).send("User not found with the given username.");
});

const searchTwt = asyncHandler(async (req, res) => {
  let i = 0;
  let tweetsColec = [];
  const { search } = req.body;
  const recentTweets = await twitterClient("v2", "tweetCountRecent", search);

  const searchTweets = await twitterClient("v2", "search", search, {
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
});

module.exports = {
  getTwtData,
  searchTwt,
};
