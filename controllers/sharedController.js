const asyncHandler = require("express-async-handler");
const sharedSchema = require("../model/sharedSchema");

const shareContent = asyncHandler(async (req, res) => {
  const { contentType, sharedTo, sharedBy, data, sharedID } = req.body;

  // validation
  if (!contentType || !data || !sharedBy || !sharedTo) {
    res.status(400);
    throw new Error("Please Include all fileds");
  }

  console.log(contentType, sharedTo, sharedBy, data);
  // //find one where isDeleted is null
  if (contentType === "Charts" || "Tweets") {
    const contentExists = await sharedSchema.findOne({
      _id: sharedID,
      sharedBy: sharedBy,
      sharedto: sharedTo,
    });
    if (contentExists) {
      res.status(200).json(contentExists);
      throw new Error("Content has Already been Shared");
    }
  }

  const sharedContents = await sharedSchema.create({
    contentType,
    sharedTo,
    sharedBy,
    isDeleted,
    data,
  });
  console.log(sharedContents);

  if (sharedContents) {
    res.status(201).json({
      _id: sharedSchema._id,
      sharedTo: sharedSchema.sharedTo,
      sharedBy: sharedSchema.sharedBy,
      data: sharedSchema.data,
      contentType: sharedSchema.contentType,
      isDeleted: sharedSchema.deletedAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const retrieveSharedCharts = async (req, res) => {
  const { userID } = req.body;
  const charts = await sharedSchema.find({
    sharedTo: userID,
    contentType: "Charts",
    isDeleted: false,
  });
  if (charts) {
    res.status(200).json({ msg: "Retrival Sucessful", data: charts });
  }
  res.status(404).json({ msg: "No Charts available" });
};

const retrieveSharedTweets = async (req, res) => {
  const { userID } = req.body;
  const tweets = await sharedSchema.find({
    sharedTo: userID,
    contentType: "Tweets",
    isDeleted: false,
  });
  if (tweets) {
    res.status(200).json({ msg: "Retrival Sucessful", data: tweets });
  }
  res.status(404).json({ msg: "No Tweets available" });
};

const unShareContent = async (req, res) => {
  //check if chart has been saved savedChart()
  //if savedChart true then check if chart has been shared in shared table
  //if shared then set isDeleted as current date
  const { userID, sharedID, sharedTo } = req.body;
  if (userID && sharedID) {
    console.log("Out");
    const shared = await sharedSchema.findOne({
      _id: sharedID,
      sharedBy: userID,
      sharedTo: sharedTo,
      isDeleted: false,
    });
    if (shared) {
      appendData = await sharedSchema.findOneAndUpdate(
        { _id: sharedID },
        { deletedAt: new Date() }
      );
    }
  }
};

module.exports = {
  shareContent,
  retrieveSharedCharts,
  retrieveSharedTweets,
  unShareContent,
};
