const mongoose = require("mongoose");
const savedTweetsSchema = mongoose.Schema(
  {
    tweetID: { type: String, required: [true, "tweet id required"] }, // yo bhaneko auto generate hune id
    tweet: { type: String, required: [true, "tweets required"] }, //yo data ma chai tweet ko original username, tweet ko text, sentiment
    createdBy: { type: String, required: [true, "userID required"] },
    isDeleted: { type: Boolean || null, required: false, default: false },
    sentiment: { type: String, required: [true, "sentiment required"] },
    context: { type: Array, required: false },
    tweetByFullname: { type: String, required: [true, "fullname required"] },
    tweetByUsername: { type: String, required: [true, "username required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("saved_tweets", savedTweetsSchema);
