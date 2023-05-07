const mongoose = require("mongoose");
const trackingSchema = mongoose.Schema(
  {
    trackedBy: { type: String, required: [true, "No username available"] },
    trackedUser: {
      type: String,
      required: [true, "Twitter username unavailable"],
    },
    twtData: { type: Array, required: [true, "data unavailable"] },
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
    trackingStart: {
      type: Date || null,
      required: false,
      default: null,
    },
    trackingEnd: {
      type: Date || null,
      required: false,
      default: null,
    },
    trackingStatus: { type: Boolean || null, required: false, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usertrackingData", trackingSchema);
