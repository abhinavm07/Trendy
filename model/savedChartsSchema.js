const mongoose = require("mongoose");
const savedChartSchema = mongoose.Schema(
  {
    createdBy: { type: String, required: [true, "No username available"] },
    chartsOptions: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("saved_charts", savedChartSchema);
