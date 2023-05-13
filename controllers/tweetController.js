const asyncHandler = require("express-async-handler");
const savedTweetsSchema = require("../model/savedTweetsSchema");

const saveTweets = asyncHandler(async (req, res) => {
  const {user, tweetData} = req.body;

  const {id: userId, name, public_metrics, username} = user;
  const {id, tweet, sentiment, context} = tweetData;
  // validation
  if (
    !userId ||
    !name ||
    !id ||
    !tweet
  ) {
    res.status(400);
    throw new Error("Please Include all fields");
  }

  const tweetsExists = await savedTweetsSchema.findOne({
    createdBy: req.user.email,
    tweetID: id,
  });
  if (tweetsExists) {
    res.status(400);
    throw new Error("Tweet Already Saved");
  } else {
    const stackCharts = await savedTweetsSchema.create({
      tweetByUsername: username,
      tweetID: id,
      tweetByFullname: name,
      tweet,
      createdBy: req.user.email,
      sentiment,
      context,
    });

    if (stackCharts) {
      res.status(201).json({
        _id: savedTweetsSchema.tweetID,
        success: true
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
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

const retriveTweets = async (req, res) => {
  const { email } = req.user;
  const savedTweets = await savedTweetsSchema.find({ createdBy: email }).sort({createdAt: -1});
  if (savedTweets) {
    res.status(200).json(savedTweets);
  } else {
    res.send("Sorry no such data found");
  }
};

module.exports = { saveTweets, deleteTweets, retriveTweets, addData };
