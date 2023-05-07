const staticAPI = require("../model/staticAPIdata");

const { tweetsSentiment } = require("../controllers/sentimentAnalysis");

const { tweetContext, contextVol } = require("../controllers/tweetContexts");

const cleanData = require("../model/cleanData");

const getID = async () => {
  let idList = [];
  let staticData = await staticAPI.find({});
  staticData.forEach((element) => {
    idList.push(JSON.stringify(element["_id"]).replace(/['"]+/g, ""));
  });

  const update = cleanStatic(idList);
};

const cleanStatic = async (idList) => {
  let userAnnotes = [];
  let user;
  let userTweets;
  let userData;
  let staticData;
  for (const staticID of idList) {
    let tweetsColec = [];
    staticData = await staticAPI.findById({ _id: staticID });
    if (staticData) {
      user = staticData["data"];
    } else {
      console.log("Static Data Not Found");
    }
    const userId = user?.data?.id || null;
    if (userId) {
      userTweets = staticData["userTweets"];
      if (userTweets) {
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
        appendingData(user, tweetsColec);
      }
    }
  }

  console.log("Success");
};

const appendingData = async (user, tweetsColec) => {
  let userAnnotes = [];
  let userData;
  let UserDataExists;
  UserDataExists = await cleanData.findOne({
    twitterUser: user["data"]["username"],
  }); // console.log(UserDataExists);
  //   console.log("\n");
  //   console.log(user["data"]["username"]);
  //   console.log("\n");
  if (UserDataExists) {
    userData = await UserDataExists.twtData;
    tweetsColec.forEach((element) => {
      if (!JSON.stringify(userData).includes(JSON.stringify(element))) {
        // console.log(element);
        userData.push(element);
      }
    });
    await UserDataExists.save();
  } else if (!UserDataExists) {
    trackUserData = await cleanData.create({
      twitterUser: user["data"]["username"],
      twtData: tweetsColec,
      userData: user,
    });
  }

  UserDataExists = await cleanData.findOne({
    twitterUser: user["data"]["username"],
  });
  userData = await UserDataExists.twtData;

  userData.forEach((element) => {
    if (element["context"]) {
      userAnnotes.push(element["context"]);
    }
  });
  const contextVolume = contextVol(userAnnotes.flat());
  const appendUserData = await cleanData.findOneAndUpdate(
    {
      twitterUser: user["data"]["username"],
    },
    { contextVolume: contextVolume }
  );
};

const retriveStatic = async (req, res) => {
  const staticData = await staticAPI.find({});
  res.status(200).json({ data: staticData, hits: staticData.length });
};

module.exports = { getID, retriveStatic };
