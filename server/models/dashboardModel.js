const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    takeme: {
      type: String,
    },
    number: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dashboard", dashboardSchema);
