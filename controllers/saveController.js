const asyncHandler = require("express-async-handler");
const savedTweetsSchema = require("../model/savedTweetsSchema");

const saveTweets = asyncHandler(async (req, res) => {
  const { createdBy, tweetData, deletedAt, tweetID } = req.body;

  // validation
  if (!createdBy || !tweetData || !tweetID) {
    res.status(400);
    throw new Error("Please Include all fileds");
  }

  console.log(createdBy, tweetID, tweetData);
  // //find one where isDeleted is null
  if (tweetID) {
    const savedTweetExists = await savedTweetsSchema.findOne({
      tweetID: tweetID,
      createdBy: createdBy,
    });
    if (savedTweetExists) {
      res
        .status(400)
        .json({ msg: "Tweet Already Saved", data: savedTweetExists });
      throw new Error("Tweet Already Saved");
    }
  }

  const savedTweetExists = await savedTweetsSchema.create({
    createdBy,
    tweetData,
    tweetID,
    deletedAt,
  });
  console.log(savedTweetExists);

  if (savedTweetExists) {
    res.status(201).json({
      _id: savedTweetsSchema._id,
      createdBy: savedTweetsSchema.createdBy,
      tweetData: savedTweetsSchema.tweetData,
      tweetID: savedTweetsSchema.tweetID,
      deletedAt: savedTweetsSchema.deletedAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const deleteTweet = async (req, res) => {
  const { savedID, createdBy } = req.body;
  const savedTweetExists = await savedTweetsSchema.findOne({
    _id: savedID,
    createdBy: createdBy,
    isDeleted: true,
  });
  if (savedTweetExists) {
    console.log("Here");
    res.status(400).json({
      msg: `Tweet with the ID of : ${savedID} has already been deleted !`,
    });
    // throw new Error("Tweet has already been deleted");
  }
  const delTweet = await savedTweetsSchema.findOneAndUpdate(
    { _id: savedID },
    { isDeleted: true },
    { deletedAt: new Date() }
  );
  res.status(200).json({ msg: `Tweet with the ID of : ${savedID} deleted !` });
};

const addDataTweet = async (req, res) => {
  const { tweetData, savedID } = req.body;
  if (savedID) {
    const savedTweetExists = await savedTweetsSchema.findById({
      _id: savedID,
    });
    if (savedTweetExists) {
      const appendData = await savedTweetsSchema.findOneAndUpdate(
        { _id: savedID },
        { tweetData: tweetData }
      );
      return res.status(200).json({ msg: "Successful !", appendData });
    }
    res.status(404).json({ msg: "No such tweet found" });
  }
};

const retrieveTweets = async (req, res) => {
  const { userID } = req.body;
  const savedTweetExists = await savedTweetsSchema.find({ createdBy: userID });
  res
    .status(200)
    .json({ msg: savedTweetExists, dataHits: savedTweetExists.length });
};

const savedTweets = async (req, res) => {
  //userID, chartId
  //check if chartid for userid exists and isDeleted null
  const { userID, savedID, isDeleted } = req.body;
  if (userID && savedID && !isDeleted) {
    console.log("ÏN");
    const savedTweetExists = await savedTweetsSchema.findOne({ _id: savedID });
    if (savedTweetExists["createdBy"] == userID) {
      res.status(200).json(savedTweetExists);
    }
  }
  console.log(userID, savedID, isDeleted);
};

// const unsaveTweet = async (req, res) => {
//   //check if chart has been saved savedChart()
//   //if savedChart true then check if chart has been shared in shared table
//   //if shared then set isDeleted as current date
//   const { userID, savedID, isDeleted } = req.body;
//   if (userID && savedID && !isDeleted) {
//     console.log("Out");
//     const shared = await sharedSchema.findOne({ _id: savedID });
//     if (shared["createdBy"] == userID) {
//       sharedSchema["isDeleted"] = Date;
//       res.status(200).json({ msg: shared });
//     } else {
//       res.status(404).json({ msg: "No such tweet found" });
//     }
//   }
// };

module.exports = {
  saveTweets,
  deleteTweet,
  retrieveTweets,
  addDataTweet,
  savedTweets,
};
