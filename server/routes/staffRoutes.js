const express = require("express");
const {
  registerStaff,
  getAllStaff,
  deleteStaff,
  payFeesToStaff,
} = require("../controllers/staff");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, registerStaff);
router.get("/", getAllStaff);
router.delete("/delete/:id", deleteStaff);
router.post("/fees/:name/:id", protect, payFeesToStaff);

module.exports = router;
