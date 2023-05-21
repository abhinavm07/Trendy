const { TwitterApi } = require("twitter-api-v2");
require("dotenv/config");
const cron = require("node-cron");
const trackingSchema = require("../model/trackUserSchema");
const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const {
  tweetContext,
  calculateVolume,
} = require("../controllers/tweetContexts");

let trackedID = [];

const { tweetsSentiment } = require("./sentimentAnalysis");

const autoTracking = async (sysUsername) => {
  const getID = await idList();

  for (const trackID of getID) {
    let retriveData = await trackingSchema.findById({
      _id: trackID,
    });

    let twtUsername = retriveData["trackedUser"];
    let user = await client.v2.userByUsername(`${twtUsername}`, {
      "user.fields": "public_metrics",
    });
    const userId = user?.data?.id || null;

    if (userId) {
      const userTweets = await client.v2.userTimeline(`${userId}`, {
        exclude: "retweets,replies",
        "tweet.fields": "context_annotations",
      });
      if (userTweets) {
        tweetAndAnnots(userTweets, user, sysUsername, trackID);
      }
    }
  }

  return { message: "CRON RAN SUCCESSFULLY" };
};

const idList = async () => {
  const trackedData = await trackingSchema.find(
    { trackingStatus: true },
    "_id"
  );
  console.log(trackedData);
  trackedData.forEach((element) => {
    const objID = JSON.stringify(element["_id"]).replace(/['"]+/g, "");
    if (!trackedID.includes(objID)) {
      trackedID.push(objID);
    }
  });
  return trackedID;
};

const getFreshData = async (user, sysUsername, tweetsColec, trackID) => {
  let userAnnotes = [];
  let UserDataExists;
  if (trackID) {
    UserDataExists = await trackingSchema.findById({
      _id: trackID,
    });

    if (UserDataExists) {
      const twitterData = await UserDataExists.twtData;
      tweetsColec.forEach((element) => {
        if (!JSON.stringify(twitterData).includes(JSON.stringify(element))) {
          twitterData.push(element);
        }
      });
      await UserDataExists.save();
    } else if (!UserDataExists && !trackID) {
      trackUserData = await trackingSchema.create({
        trackedUser: user["data"]["username"],
        trackedBy: sysUsername,
        twtData: tweetsColec,
        userData: user,
        trackingStatus: true,
      });
    } else {
      console.log("No Such Data");
    }

    UserDataExists = await trackingSchema.findOne({
      trackedBy: sysUsername,
      trackedUser: user["data"]["username"],
      trackingStatus: true,
    });
    if (UserDataExists) {
      const userData = await UserDataExists.twtData;

      userData.forEach((element) => {
        if (element["context"]) {
          userAnnotes.push(element["context"]);
        }
      });
      const contextVolume = calculateVolume(userAnnotes.flat());
      const appendUserData = await trackingSchema.findOneAndUpdate(
        {
          trackedBy: sysUsername,
          trackedUser: user["data"]["username"],
          trackingStatus: true,
        },
        { contextVolume: contextVolume }
      );
    }
  }
};

const tweetAndAnnots = async (userTweets, user, sysUsername, trackID) => {
  let userAnnotes = [];
  let tweetsColec = [];
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
  const updateData = await getFreshData(
    user,
    sysUsername,
    tweetsColec,
    trackID
  );
};

// const scheduler = cron.schedule("* * * * *", logger);

module.exports = { autoTracking };
