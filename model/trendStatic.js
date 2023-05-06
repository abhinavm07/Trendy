const mongoose = require("mongoose");
const trendStatic = mongoose.Schema({
  data: { type: Object, required: [true, "data unavailable"] },
  createdAt: {
    type: Date || null,
    required: false,
    default: null,
  },
  isDeleted: { type: Boolean || null, required: false, default: false },
});

module.exports = mongoose.model("trendStaticData", trendStatic);
