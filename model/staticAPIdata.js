const mongoose = require("mongoose");
const staticAPI = mongoose.Schema({
  data: { type: Object, required: [true, "data unavailable"] },
  createdAt: {
    type: Date || null,
    required: false,
    default: null,
  },
  userTweets: { type: Object, required: [true, "data unavailable"] },
  isDeleted: { type: Boolean || null, required: false, default: false },
});

module.exports = mongoose.model("static_API_data", staticAPI);
