const mongoose = require("mongoose");

const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Name is Empty"],
    },
    username: {
      type: String,
      // required: [true, "Username can't be empty"],
    },
    email: {
      type: String,
      // required: [true, "Username can't be empty"],
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trendy", appSchema);
