const catchAsync = require("express-async-handler");
const { capitalize } = require("../config/capatilize");
const Student = require("../models/studentModel");
const NepaliDate = require("nepali-date-converter");
const StudentFees = require("../models/studentFeesModel");
const StudentAttendence = require("../models/studentAttendanceModel");
const Dashboard = require("../models/dashboardModel");

exports.getAll = catchAsync(async (req, res) => {
  const students = await Student.find({}).exec();
  res.json(students);
});

exports.classWithId = catchAsync(async (req, res) => {
  const students = await Student.find({ classname: req.params.id });
  if (students.length > 0) {
    res.json(students);
  } else {
    res.status(404).json({ message: "No any students" });
  }
});

exports.loadAttendance = catchAsync(async (req, res) => {
  const students = await StudentAttendence.findOne({
    attendence_date: new NepaliDate().format("YYYY-MM-D"),
    classname: req.params.id,
  });
  if (students) {
    res.json(students);
  } else {
    res.status(404).json({ message: "No any students" });
  }
});

exports.filterStudents = catchAsync(async (req, res) => {
  const student = await Student.findOne({
    student_name: capitalize(req.params.name),
    class: capitalize(req.params.class),
    roll_no: capitalize(req.params.roll_no),
  });
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "No any students" });
  }
});

exports.registerStudents = catchAsync(async (req, res) => {
  const {
    student_name,
    classname,
    address,
    parents_name,
    contact_no,
    gender,
    age,
    email,
    registration_fees,
    image,
  } = req.body;
  const student_info =
    (await Student.find({ classname })) &&
    (await Student.findOne({ classname }).sort({ roll_no: -1 }).limit(1));
  if (student_info) {
    var roll_no = student_info.roll_no + 1;
  } else {
    var roll_no = 171;
  }

  const registered_by = req.user.name;
  const previous_dues = 0;
  const studentname = capitalize(student_name);
  const new_student = await Student.create({
    registered_by,
    student_name: studentname,
    email,
    address,
    gender,
    classname,
    contact_no,
    roll_no,
    parents_name,
    age,
    previous_dues,
    registration_fees,
    image,
  });
  if (new_student) {
    const total_student = (await Student.find()).length;
    await Dashboard.findOneAndUpdate(
      { title: "Students" },
      { number: total_student }
    );
    res.status(200).json({ message: "Student registered" });
  } else {
    res.status(400);
    throw new Error("Count save");
  }
});

exports.studentsAttendence = catchAsync(async (req, res) => {
  const { students } = req.body;
  const class_teacher = req.user.name;
  const attendanceFound = await StudentAttendence.findOne({
    attendanceFound: new NepaliDate().format("YYYY-MM_D"),
    classname: req.params.classname,
  });
  if (attendanceFound) {
    await StudentAttendence.updateOne(
      {
        _id: attendanceFound._id,
      },
      { $set: { students: students } }
    );
    res.status(200).json({ message: "Attendance taken sucessfully" });
  } else {
    const new_attendance = await StudentAttendence.create({
      class_teacher,
      classname: req.params.classname,
      attendence_date: new NepaliDate().format("YYYY-MM_D"),
      students,
    });
    if (new_attendance) {
      res.status(201).json({ message: "Attadence taken sucessfully" });
    } else {
      res.status(400);
      throw new Error("Unable to take attendance");
    }
  }
});

exports.deleteStudents = catchAsync(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (student) {
    await student.remove();
    const total_students = (await Student.find()).length;
    await Dashboard.findOneAndUpdate(
      { title: "Student" },
      { number: total_students }
    );
    res.json({ message: "Student removed" });
  } else {
    res.status(400);
    throw new Error("No student found");
  }
});

exports.studentFees = catchAsync(async (req, res) => {
  const {
    student_name,
    classname,
    roll_no,
    month_name,
    year,
    monthly_fees,
    hostel_fees,
    laboratory_fees,
    computer_fees,
    exam_fees,
    miscellaneous,
  } = req.body;
  const student = await Student.findById(req.params.id);

  if (student) {
    const accountant = req.user.name;
    const fees_submitted = await StudentFees.create({
      accountant,
      student_name,
      classname,
      roll_no,
      month_name,
      year,
      monthly_fees,
      hostel_fees,
      laboratory_fees,
      computer_fees,
      exam_fees,
      miscellaneous,
    });
    const totalFees = await StudentFee.find()
      .select(
        "monthly_fees hostel_fees laboratory_fees computer_fees exam_fees miscellaneous"
      )
      .select("-id");

    var totalFees1 = 0;
    totalFees.map(
      (fee) =>
        (total_Fee1 =
          total_Fee1 +
          fee.monthly_fees +
          fee.hostel_feel +
          fee.laboratory_fees +
          fee.computer_fees +
          fee.exam_fees +
          fee.miscellaneous)
    );
    await Dashboard.findOneAndUpdate(
      { title: "Income" },
      { number: totalFees1 }
    );
    res.status(201).json({ message: "Fees paid" });
  } else {
    res.status(400);
    throw new Error("Student fee not paid");
  }
});
