const mongoose = require("mongoose");
const savedSchema = mongoose.Schema({
  createdBy: { type: String, required: [true, "No username available"] },
  chartsOptions: {
    type: Array,
    required: [true, "No options available"],
  },
  data: { type: Array, required: [true, "data unavailable"] },
  extraOptions: {
    type: Array || null,
    required: false,
    default: null,
  },
  deletedAt: {
    type: Date || null,
    required: false,
    default: null,
  },
  isDeleted: { type: Boolean || null, required: false, default: false },
});

module.exports = mongoose.model("saved_charts", savedSchema);
