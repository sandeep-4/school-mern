const mongoose = require("mongoose");

const teacherSalarySchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },

    teacher_name: {
      type: String,
      required: true,
    },
    teacherId: {
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

module.exports = mongoose.model("TeacherSalary", teacherSalarySchema);
