const staticAPI = require("../model/staticAPIdata");

const { tweetsSentiment } = require("../controllers/sentimentAnalysis");

const {
  tweetContext,
  calculateVolume,
  arrayValue,
} = require("../controllers/tweetContexts");

const cleanData = require("../model/cleanData");

const getID = async () => {
  let idList = [];
  const staticData = await staticAPI.find({});
  // console.log(staticData);
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
  // console.log(idList);
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
          if (twt) {
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
        }
        const contextVolume = await calculateVolume(userAnnotes.flat());
        appendingData(user, tweetsColec);
      }
    }
  }

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
  const contextVolume = calculateVolume(userAnnotes.flat());
  const contextValues = arrayValue(contextVolume);
  const appendUserData = await cleanData.findOneAndUpdate(
    {
      twitterUser: user["data"]["username"],
    },
    { $set: { contextVolume: contextVolume, contextValue: contextValues } }
  );
};

const retriveStatic = async (req, res) => {
  const { id } = req.body;
  const staticData = await staticAPI.findById({ _id: id });
  if (staticData) {
    res.status(200).json({ data: staticData, hits: staticData.length });
  } else {
    console.log("No Such Data");
  }
};

// getID();
module.exports = { getID, retriveStatic };
