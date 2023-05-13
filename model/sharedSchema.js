const mongoose = require("mongoose");
const sharedSchema = mongoose.Schema(
  {
    contentType: { type: String, required: [true, "Content not available"] }, //chart / tweet
    sharedBy: { type: String, required: [true, "tweet id required"] }, //req.user.email
    sharedTo: { type: String, required: [true, "Full Name required"] }, //field ko input ko email
    isDeleted: {
      type: Boolean,
      default: false,
    },
    savedId: { type: String, required: [true, "Not saved"] }, //_id
  },
  { timestamps: true }
);

module.exports = mongoose.model("shared", sharedSchema);
