require("dotenv/config");
const asyncHandler = require("express-async-handler");

const twitterClient = require("./dataFetcher");

const staticAPI = require("../model/staticAPIdata");

const { userTracking } = require("../controllers/userTracking");
// const { logger } = require("./autoUserTracker");

const { tweetsSentiment } = require("../controllers/sentimentAnalysis");

const {
  tweetContext,
  calculateVolume,
} = require("../controllers/tweetContexts");

// const { retriveSysUsers } = require("../controllers/admin");

const { recommend } = require("../controllers/recommendation");
const { compare } = require("bcrypt");

const getCompareData = async (req, res) => {
  const {
    userOne: twitterUser1,
    userTwo: twitterUser2,
    staticIDs,
    sysUsername,
  } = req.body;
  let user;
  // let staticData;
  // let contextReps = [];
  let compareData = [];
  let usersList = [];
  let userStatic = [];
  if (staticIDs) {
    for (const id of staticIDs) {
      const staticDataExists = await staticAPI.findById({ _id: id });
      if (staticDataExists) {
        const twtUsername = staticDataExists.data.data.username;
        usersList.push(twtUsername);
        userStatic.push(staticDataExists);
      } else {
        return res.status(404).send("User not found with the given staticID.");
      }
    }
  } else if (twitterUser1 && twitterUser2) {
    usersList = [twitterUser1, twitterUser2];
  } else {
    res.send("Sorry! Something Went Wrong");
  }

  if (userStatic) {
    for (const data of userStatic) {
      user = data["data"];
      compareData.push(await getData(user, user.data.username));
    }
  }

  if (usersList) {
    for (const twtUser of usersList) {
      user = await twitterClient("v2", "userByUsername", twtUser, {
        "user.fields": "public_metrics",
      });
      const allData = await getData(user, twtUser);
      const { contextVolume, userData } = allData[twtUser];
      const { name, public_metrics, username } = userData.data;
      const { followers_count, following_count, tweet_count } = public_metrics;
      const context = contextVolume && Object.keys(contextVolume);
      const neededData = {
        [twtUser]: {
          contextVolume,
          name,
          followers_count,
          following_count,
          tweet_count,
          username,
          context:
            context && context.length > 4 ? context.slice(0, 4) : context,
        },
      };
      compareData.push(neededData);
    }
  }

  res.json(compareData);
};

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

const getData = async (user, twtUser) => {
  let tweetsColec = [];
  let userAnnotes = [];
  let sentimentArray = [];
  const userId = user?.data?.id || null;
  if (userId) {
    const userTweets = await twitterClient("v2", "userTimeline", userId, {
      exclude: "retweets,replies",
      "tweet.fields": "context_annotations",
    });

    if (userTweets) {
      let twtData = userTweets["_realData"]["data"];
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

      // const newArray = Object.entries(contextVolume).flatMap(([index, value]) =>
      //   Array(value).fill(index)
      // );
      // contextReps.push(newArray);

      // contextReps = contextReps.flat();
      const twtUserData = {
        [twtUser]: {
          userData: user,
          twtData: tweetsColec,
          contextVolume: contextVolume,
          sentimentVolume: sentimentVolume,
        },
      };
      return twtUserData;
    } else {
      return res
        .status(404)
        .send(
          "User account is not public, please search for a user with public tweets."
        );
    }
  } else {
    return res.status(404).send("User not found with the given username.");
  }
};

module.exports = {
  getCompareData,
  searchTwt,
};
