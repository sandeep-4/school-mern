const mongoose = require("mongoose");

const teacherModel = new mongoose.Schema(
  {
    registred_by: {
      type: String,
      required: true,
    },
    tecaher_name: {
      type: String,
      required: true,
    },
    teacherId: Number,
    qualification: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    previous_school: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    estimated_salary: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    subjectToTeach: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherModel);
