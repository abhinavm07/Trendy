const trackingSchema = require("../model/trackUserSchema");
const { tweetContext, contextVol } = require("../controllers/tweetContexts");

const userTracking = async (user, sysUsername, tweetsColec) => {
  let userAnnotes = [];
  let userData;
  let UserDataExists;
  UserDataExists = await trackingSchema.findOne({
    trackedBy: sysUsername,
    trackedUser: user["data"]["username"],
    trackingStatus: true,
  }); // console.log(UserDataExists);

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
    trackUserData = await trackingSchema.create({
      trackedUser: user["data"]["username"],
      trackedBy: sysUsername,
      twtData: tweetsColec,
      userData: user,
      trackingStatus: true,
    });
  }

  UserDataExists = await trackingSchema.findOne({
    trackedBy: sysUsername,
    trackedUser: user["data"]["username"],
    trackingStatus: true,
  });
  userData = await UserDataExists.twtData;

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

const retriveTrackedUserData = async (req, res) => {
  const { userID } = req.body;
  const trackedDataExists = await trackingSchema.find({
    trackedBy: userID,
    trackingStatus: true,
  });
  if (trackedDataExists) {
    return res
      .status(200)
      .json({ msg: trackedDataExists, dataHits: trackedDataExists.length });
  }
  return res.status(404).json({ msg: "Sorry! No such data found" });
};

const suspendTracking = async (req, res) => {
  const { trackedUser, userID } = req.body;
  const trackedDataExists = await trackingSchema.findOne({
    trackedBy: userID,
    trackedUser: trackedUser,
  });
  console.log(trackedDataExists);
  if (trackedDataExists) {
    if (trackedDataExists["trackingStatus"] === false) {
      console.log("Here");
      return res.status(400).json({
        msg: `Tracked Data with the ID of : ${JSON.stringify(
          trackedDataExists["_id"]
        )} has already been deleted !`,
      });
      // throw new Error("Tweet has already been deleted");
    }
    const delTrackedData = await trackingSchema.findOneAndUpdate(
      {
        trackedBy: userID,
        trackedUser: trackedUser,
      },
      { trackingStatus: false }
    );
    return res.status(200).json({
      msg: `Tracked Data with the ID of : ${JSON.stringify(
        trackedDataExists["_id"]
      )} has been deleted !`,
    });
  }
  return res.status(404).json({
    msg: `Tracked Data not found`,
  });
};

const changeTrackStatus = async (req, res) => {
  const { trackedUser, userID, status, trackID } = req.body;
  let trackedDataExists;
  if (trackID) {
    trackedDataExists = await trackingSchema.findById({
      _id: trackID,
    });
  } else if (trackedUser || userID) {
    trackedDataExists = await trackingSchema.findOne({
      trackedBy: userID,
      trackedUser: trackedUser,
    });
  }

  console.log(trackedDataExists);
  if (trackedDataExists) {
    if (trackedDataExists["trackingStatus"] == status) {
      console.log("Here");
      return res.status(400).json({
        msg: `Tracked Status is already ${status}`,
      });
      // throw new Error("Tweet has already been deleted");
    }
    if (trackID) {
      const changeTrackedStatus = await trackingSchema.findOneAndUpdate(
        {
          _id: trackID,
        },
        { trackingStatus: status }
      );
    }
    const changeTrackedStatus = await trackingSchema.findOneAndUpdate(
      {
        trackedBy: userID,
        trackedUser: trackedUser,
      },
      { trackingStatus: status }
    );
    return res.status(200).json({
      msg: `Tracked Data with the ID of : ${JSON.stringify(
        trackedDataExists["_id"]
      )} has been changed to ${status} !`,
    });
  }
  return res.status(404).json({
    msg: `Tracked Data not found`,
  });
};

module.exports = {
  userTracking,
  retriveTrackedUserData,
  suspendTracking,
  changeTrackStatus,
};
