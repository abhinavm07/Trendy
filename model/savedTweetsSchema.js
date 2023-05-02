const mongoose = require("mongoose");
const savedTweetsSchema = mongoose.Schema({
  tweetID: { type: String, required: [true, "tweet id required"] }, // yo bhaneko auto generate hune id
  tweetData: { type: Object, required: [true, "tweets required"] }, //yo data ma chai tweet ko original username, tweet ko text, sentiment
  createdBy: { type: String, required: [true, "userID required"] },
  deletedAt: { type: Date || null, required: false, default: null },
  isDeleted: { type: Boolean || null, required: false, default: false },
});

module.exports = mongoose.model("saved_tweets", savedTweetsSchema);
