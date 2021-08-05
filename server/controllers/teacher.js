const Teacher = require("../models/teacherModel");
const asyncHandler = require("express-async-handler");
const { capitalize } = require("../config/capatilize");
const Dashboard = require("../models/dashboardModel");
const StudentFees = require("../models/studentFeesModel");
const TeacherSalary = require("../models/teacherSalaryModel");
const TeacherAttendance = require("../models/teacherAttendanceModel");
const NonTeachingStaffSalary = require("../models/teacherAttendanceModel");

exports.registerTeacher = asyncHandler(async (req, res) => {
  const {
    teacher_name,
    qualification,
    address,
    contact_no,
    gender,
    previous_school,
    age,
    email,
    estimated_salary,
    image,
    subjectToTeach,
  } = req.body;
  const teacher_info =
    (await Teacher.find()) &&
    (await Teacher.findOne().sort({ teacherId: -1 }).limit(1));

  if (teacher_info) {
    var teacherId = teacherInfo.teacherId + 1;
  } else {
    var teacherId = 181;
  }
  const registered_by = req.user.name;
  const teachername = capitalize(teacher_name);
  const new_teacher = await Teacher.create({
    registered_by,
    teacher_name: teachername,
    teacherId,
    qualification,
    address,
    contact_no,
    gender,
    previous_school,
    age,
    email,
    estimated_salary,
    image,
    subjectToTeach,
  });
  if (new_teacher) {
    const total_teachers = (await Teacher.find()).length;
    await Dashboard.findOneAndUpdate(
      { title: "Teacher" },
      { number: total_teachers }
    );
    res.status(201).json({
      message: "tetacher registered sucessfully",
    });
  } else {
    res.status(400);
    throw new Error("Unable to register");
  }
});

exports.getAllTeacher = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({}).exec();
  if (teachers.length > 0) {
    res.json(teachers);
  } else {
    res.status(400);
    throw new Error("Teachers ...");
  }
});

exports.deleteTeachers = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ teacherId: req.params.id }).exec();
  if (teacher) {
    await teacher.remove();
    total_teachers = (await Teacher.find()).length;
    await Dashboard.findOneAndUpdate(
      { title: "Teachers" },
      { number: total_teachers }
    );
    res.json(201).json({ message: "Teachers deleted" });
  } else {
    res.status(400);
    throw new Error("Unable delete");
  }
});

exports.payTeachers = asyncHandler(async (req, res) => {
  const { salaryForTheYear, salaryForTheMonth, salaryAmount } = req.body;
  const teacher_info = await Teacher.findOne({
    teacher_name: capitalize(req.params.name),
    teacherId: req.params.id,
  });
  if (teacher_info) {
    const admin = req.user.name;
    const teachername = capitalize(req.params.name);
    const monthname = capitalize(salaryForTheMonth);
    const new_teacher = await TeacherSalary.create({
      admin,
      teacher_name: teachername,
      teacherId: req.params.id,
      salaryForTheYear,
      salaryForTheMonth: monthname,
      salaryAmount,
    });
    if (new_teacher) {
      const Fees = await TeacherSalary.find()
        .select("salaryAmount")
        .select("-id");

      var total_Fee = 0;
      Fees.map((fee) => (total_Fee = total_Fee + fee.salaryAmount));

      const Fees1 = await NonTeachingStaffSalary.find()
        .select("salaryAmount")
        .select("-id");
      var total_Fee1 = 0;

      Fees1.map((fee) => (total_Fee1 = total_Fee1 + fee.salaryAmount));

      await Dashboard.findOneAndUpdate(
        { title: "Salary Exepnses" },
        { number: total_Fee + total_Fee1 }
      );
      res.status(201).json({
        message: "Teachers salary paid sucessfully",
      });
    } else {
      res.status(400);
      throw new Error("Unable to pay");
    }
  } else {
    res.status(400);
    throw new Error("Unable to pay");
  }
});

exports.getAllIncome = asyncHandler(async (req, res) => {
  const income = await StudentFees.find({});
  if (income.length > 0) {
    res.json(income);
  } else {
    res.status(400);
    throw new Error("Unable to imcome");
  }
});

exports.allIncomeInYear = asyncHandler(async (req, res) => {
  const income = await StudentFees.find({ year: req.params.year });
  if (income.length > 0) {
    res.json(income);
  } else {
    res.status(400);
    throw new Error("Unable to imcome");
  }
});

exports.incomeMonthOfAGivenYear = asyncHandler(async (req, res) => {
  const income = await StudentFees.find({
    year: req.params.year,
    month_name: capitalize(req.params.month),
  });
  if (income.length > 0) {
    res.json(income);
  } else {
    res.status(400);
    throw new Error("Unable to imcome");
  }
});

exports.allSalary = asyncHandler(async (req, res) => {
  const salary = await TeacherSalary.find({});
  const staffSalary = await NonTeachingStaffSalary.find({});
  if (salary.length > 0 || staffSalary.length > 0) {
    var new_salary = salary.concat(staffSalary);
    res.json(new_salary);
  } else {
    res.status(400);
    throw new Error("Unable to salary");
  }
});

exports.salaryOfAYear = asyncHandler(async (req, res) => {
  const salary = await TeacherSalary.find({
    salaryForTheYear: req.params.year,
  });
  const staffSalary = await NonTeachingStaffSalary.find({
    salaryForTheYear: req.params.year,
  });
  if (salary.length > 0 || staffSalary.length > 0) {
    var new_salary = salary.concat(staffSalary);
    res.json(new_salary);
  } else {
    res.status(400);
    throw new Error("Unable to salary");
  }
});

exports.salaryOfAmonthOfAYear = asyncHandler(async (req, res) => {
  const salary = await TeacherSalary.find({
    salaryForTheYear: req.params.year,
    salaryForTheMonth: capitalize(req.params.month),
  });
  const staffSalary = await NonTeachingStaffSalary.find({
    salaryForTheYear: req.params.year,
    salaryForTheMonth: capitalize(req.params.month),
  });
  if (salary.length > 0 || staffSalary.length > 0) {
    var new_salary = salary.concat(staffSalary);
    res.json(new_salary);
  } else {
    res.status(400);
    throw new Error("Unable to salary");
  }
});
