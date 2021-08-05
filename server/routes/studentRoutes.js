const express = require("express");
const {
  getAll,
  classWithId,
  loadAttendance,
  filterStudents,
  registerStudents,
  studentsAttendence,
  deleteStudents,
  studentFees,
} = require("../controllers/student");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getAll);
router.get("class/:id", classWithId);
router.get("/class/:id/attendance", loadAttendance);
router.get("/search/:name/:class/:roll_no", filterStudents);
router.post("/register", protect, registerStudents);
router.post("/attendance/:classname", protect, studentsAttendence);
router.delete("/delete/:id", deleteStudents);
router.post("/fees/:id", protect, studentFees);
module.exports = router;
