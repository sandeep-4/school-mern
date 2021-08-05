const asyncHandler = require("express-async-handler");
const NonTeachingStaff = require("../models/nonTeachingStaff");
const Dashboard = require("../models/dashboardModel");
const NonTeachingStaffSalary = require("../models/nonTeachingStaffSalary");
const NonTeachingStaffAttendence = require("../models/nonTeachingStaffAttendance");
const TeacherSalary = require("../models/teacherSalaryModel");
const { capitalize } = require("../config/capatilize");
const nonTeachingStaff = require("../models/nonTeachingStaff");

exports.registerStaff = asyncHandler(async (req, res) => {
  const {
    staff_name,
    qualification,
    address,
    contact_no,
    gender,
    previous_school,
    age,
    email,
    estimated_salary,
    image,
    work,
  } = req.body;

  const staff_info =
    (await NonTeachingStaff.find()) &&
    (await NonTeachingStaff.findOne().sort({ staffId: -1 }).limit(1));

  if (staff_info) {
    var staffId = 17247 + staff_info.staffId + 1;
  } else {
    var staffId = 17247;
  }
  const registred_by = req.user.name;

  const staffname = capitalize(staff_name);
  const new_staff = await NonTeachingStaff.create({
    registred_by,
    staff_name: staffname,
    staffId,
    qualification,
    address,
    contact_no,
    gender,
    previous_school,
    age,
    email,
    estimated_salary,
    image,
    work,
  });
  if (new_staff) {
    const total_staffs = (await NonTeachingStaff.find()).length;
    await Dashboard.findOneAndUpdate(
      { title: "Woking Staffs" },
      {
        number: total_staffs,
      }
    );
    res.status(201).json({
      message: "Staff registered",
    });
  } else {
    res.status(400);
    throw new Error("Unable to register staff");
  }
});

exports.deleteStaff = asyncHandler(async (req, res) => {
  const staff = await NonTeachingStaff.findOne({ staffId: req.params.id });
  if (staff) {
    await staff.remove();
    const total_staffs = (await NonTeachingStaff.find()).length;
    await Dashboard.findOneAndUpdate(
      { title: "Working staffs" },
      {
        number: total_staffs,
      }
    );
    res.json({ message: "Staff deleted" });
  } else {
    res.status(404);
    throw new Error("Error deleting");
  }
});

exports.getStaffs = asyncHandler(async (req, res) => {
  const staffs = await NonTeachingStaff.find({});
  if (staffs.length > 0) {
    res.json(staffs);
  } else {
    res.status(404);
    throw new Error("User needed");
  }
});

exports.payFeesToStaff = asyncHandler(async (req, res) => {
  const { salaryForTheYear, salaryForTheMonth, salaryAmount } = req.body;
  const staff_info = await NonTeachingStaff.findOne({
    staff_name: capitalize(req.params.name),
    staddId: req.params.id,
  });
  if (staff_info) {
    const admin = req.user.name;
    const staffname = capitalize(req.params.name);
    const monthname = capitalize(salaryForTheMonth);
    const new_staff = await NonTeachingStaffSalary.create({
      admin,
      staff_name: staffname,
      staffId: req.params.id,
      salaryForTheYear,
      salaryForTheMonth: monthname,
      salaryAmount,
    });
    if (new_staff) {
      const Fees = await TeacherSalary.find()
        .select("salaryAmount")
        .select("-_id");
      var total_Fees = 0;
      Fees.map((fee) => (total_Fees = total_Fees + fee.salaryAmount));

      const Fees1 = await NonTeachingStaffSalary.find()
        .select("salaryAmount")
        .select("-_id");
      var total_Fees1 = 0;
      Fees.map((fee) => (total_Fees1 = total_Fees1 + fee.salaryAmount));

      await Dashboard.findOneAndUpdate(
        { title: "Salary Expenses" },
        { number: total_Fees + total_Fees1 }
      );
      res.status(201).json({
        message: "staff salary paid sucessflly",
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

exports.getAllStaff = asyncHandler(async (req, res) => {
  const staffs = await NonTeachingStaff.find({});
  if (staffs.length > 0) {
    res.json(staffs);
  } else {
    res.status(400);
    throw new Error("Unable to staffs");
  }
});
