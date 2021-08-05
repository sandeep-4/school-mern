const express = require("express");
const router = express.Router();

const { getUser, login } = require("../controllers/admin");
const { protect } = require("../middleware/authMiddleware");

router.post("/", login);
router.get("/", protect, getUser);

module.exports = router;
