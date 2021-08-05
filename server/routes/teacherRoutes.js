const express = require("express");

const router = express.Router();

const {
  payTeachers,
  registerTeacher,
  getAllTeacher,
  deleteTeachers,
  getAllIncome,
  allIncomeInYear,
  incomeMonthOfAGivenYear,
  allSalary,
  salaryOfAYear,
  salaryOfAmonthOfAYear,
} = require("../controllers/teacher");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", protect, registerTeacher);
router.get("/", getAllTeacher);
router.delete("/delete/:id", deleteTeachers);
router.post("/fees/:name/:id", protect, payTeachers);
router.get("/allincome", getAllIncome);
router.get("/allincome.:year", allIncomeInYear);
router.get("/allincome/:year/:month", incomeMonthOfAGivenYear);
router.get("/allsalaries", allSalary);
router.get("/allsalaries/:year", salaryOfAYear);
router.get("allsalaries/:year/:month", salaryOfAmonthOfAYear);

module.exports = router;
