const mongoose = require("mongoose");
const cleanData = mongoose.Schema(
  {
    twtData: { type: Array, required: [true, "data unavailable"] },
    twitterUser: { type: String, required: [true, "data unavailable"] },
    userData: {
      type: Array || null,
      required: false,
      default: null,
    },
    contextVolume: {
      type: Array || null,
      required: false,
      default: null,
    },
    contextValue: {
      type: Array || null,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cleanData", cleanData);
