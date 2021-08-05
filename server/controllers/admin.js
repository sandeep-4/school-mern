const Admin = require("../models/adminModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  const token = generateToken(user._id);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credintials");
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await Admin.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("No suvh user");
  }
});
