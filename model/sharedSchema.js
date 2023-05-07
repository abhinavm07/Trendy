const mongoose = require("mongoose");
const sharedSchema = mongoose.Schema(
  {
    contentType: { type: String, required: [true, "Content not available"] },
    sharedBy: { type: String, required: [true, "tweet id required"] },
    sharedTo: { type: String, required: [true, "Full Name required"] },
    isDeleted: {
      type: Boolean,
      required: [true, "tweets required"],
      default: false,
    },
    data: { type: Date, required: [true, "userID required"] },
    sharedAt: { type: Date, required: [true, "userID required"] },
    savedId: { type: String, required: [true, "Not saved"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shared", sharedSchema);
