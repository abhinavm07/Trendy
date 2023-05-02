const asyncHandler = require("express-async-handler");
const savedTweetsSchema = require("../model/savedTweetsSchema");

const saveCharts = asyncHandler(async (req, res) => {
  const {
    tweetByUsername,
    tweetId,
    tweetByFullname,
    TweetL,
    createdBy,
    Sentiment,
  } = req.body;

  // validation
  if (
    !tweetByUsername ||
    !tweetId ||
    !tweetByFullname ||
    !TweetL ||
    !createdBy ||
    !Sentiment
  ) {
    res.status(400);
    throw new Error("Please Include all fileds");
  }

  //Create User
  const stackCharts = await savedTweetsSchema.create({
    tweetByUsername,
    tweetId,
    tweetByFullname,
    TweetL,
    createdBy,
    Sentiment,
    extraOptions,
    deletedAt,
  });

  if (stackCharts) {
    res.status(201).json({
      _id: savedTweetsSchema._id,
      tweetByUsername: savedTweetsSchema.tweetByUsername,
      tweetId: savedTweetsSchema.tweetId,
      tweetByFullname: savedTweetsSchema.tweetByFullname,
      TweetL: savedTweetsSchema.TweetL,
      createdBy: savedTweetsSchema.createdBy,
      Sentiment: savedTweetsSchema.Sentiment,
      extraOptions: savedTweetsSchema.extraOptions,
      deletedAt: savedTweetsSchema.deletedAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const deleteTweets = async (req, res) => {
  const { id: tweetID } = req.params;
  const delTweets = await savedTweetsSchema.findByIdAndDelete({ _id: tweetID });
  console.log(delChart);
  res.status(200).json({ msg: `Chart with the ID of : ${tweetID} deleted !` });
};

const addData = async (req, res) => {
  const savedTweets = await savedTweetsSchema.create(req.query);
  res.status(200).json({ msg: "Successful !" });
};

const retriveCharts = async (req, res) => {
  const { id: userID } = req.params;
  const savedTweets = await model.find({ _id: userID });
  res.status(200).json({ msg: savedTweets });
};

module.exports = { saveCharts, deleteCharts, retriveCharts, addData };
