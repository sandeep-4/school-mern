const mongoose = require("mongoose");

const studentAttendenceSchema = new mongoose.Schema(
  {
    class_teacher: {
      type: String,
      required: true,
    },
    attendance_date: {
      type: Date,
      required: Date.now(),
    },
    classname: {
      type: String,
      required: true,
    },
    students: [
      {
        student_name: {
          type: String,
          required: true,
        },
        classname: {
          type: String,
          required: true,
        },
        roll_no: {
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

module.exports = mongoose.model("StudentAttendance", studentAttendenceSchema);
