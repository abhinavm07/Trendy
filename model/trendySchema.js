const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Empty"],
  },
  username: {
    type: String,
    required: [true, "Username can't be empty"],
  },
});

module.exports = mongoose.model("Trendy", appSchema);
