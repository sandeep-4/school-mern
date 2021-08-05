const mongoose = require("mongoose");

const nonTeachingStaffAttendanceSchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },
    attendance_date: {
      type: Date,
      required: Date.now(),
    },
    staffs: [
      {
        staff_name: {
          type: String,
          required: true,
        },
        staffId: {
          type: Number,
          required: true,
        },
        present: {
          type: Boolean,
          default: false,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "nonTeachingStaffAttendance",
  nonTeachingStaffAttendanceSchema
);
