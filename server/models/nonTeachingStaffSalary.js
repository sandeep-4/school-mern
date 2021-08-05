const mongoose = require("mongoose");

const nonTeachingStaffSalarySchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },

    staff_name: {
      type: String,
      required: true,
    },
    staffId: {
      type: Number,
      required: true,
    },
    salaryForTheYear: {
      type: String,
      required: true,
    },
    salaryForTheMonth: {
      type: String,
      required: true,
    },
    salaryAmount: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model(
  "NonTeachingStaffSalary",
  nonTeachingStaffSalarySchema
);
