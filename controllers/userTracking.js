const trackingSchema = require("../model/trackUserSchema");
const { tweetContext, contextVol } = require("../controllers/tweetContexts");

const userTracking = async (user, sysUsername, tweetsColec, trackID) => {
  let userAnnotes = [];
  let UserDataExists;
  if (trackID) {
    UserDataExists = await trackingSchema.findById({
      trackedBy: sysUsername,
      _id: trackID,
    });
  } else {
    UserDataExists = await trackingSchema.findOne({
      trackedBy: sysUsername,
      trackedUser: user["data"]["username"],
      trackingStatus: true,
    });
  }

  if (UserDataExists) {
    const userData = await UserDataExists.twtData;
    tweetsColec.forEach((element) => {
      if (!JSON.stringify(userData).includes(JSON.stringify(element))) {
        userData.push(element);
      }
    });
    await UserDataExists.save();
  } else {
    trackUserData = await trackingSchema.create({
      trackedUser: user["data"]["username"],
      trackedBy: sysUsername,
      twtData: tweetsColec,
      userData: user,
      trackingStatus: true,
    });
  }

  const userData = await UserDataExists.twtData;

  userData.forEach((element) => {
    if (element["context"]) {
      userAnnotes.push(element["context"]);
    }
  });
  const contextVolume = contextVol(userAnnotes.flat());
  const appendUserData = await trackingSchema.findOneAndUpdate(
    {
      trackedBy: sysUsername,
      trackedUser: user["data"]["username"],
      trackingStatus: true,
    },
    { contextVolume: contextVolume }
  );
};

module.exports = { userTracking };
