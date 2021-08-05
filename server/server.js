const express = require("express");
const app = express();
const { readdirSync } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const bodyParse = require("body-parser");
require("dotenv").config();
const path = require("path").posix;
const mongoose = require("mongoose");

const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const staffRoutes = require("./routes/staffRoutes");
const adminRoutes = require("./routes/adminRoutes");
const Dashboard = require("./models/dashboardModel");

//middlewares
app.use(bodyParse.json({ limit: "5mb" }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT;
const mongoDb = process.env.MONGO;

//dashboard
app.get("/dashboard", async (req, res) => {
  const items = await Dashboard.find();
  res.json(items);
});

//routes
app.use("/api/students", studentRoutes);
app.use("/api/login", adminRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/staffs", staffRoutes);
//cloudinary
app.get("/api/config/cloudinary", (req, res) => {
  res.send(process.env.CLOUDINARY_URL);
});

app.get("/api/config/clofinarypreset", (req, res) => {
  res.send(process.env.CLOUDINARY_UPLOAD_PRESET);
});

const __dirnames = path.resolve();

//production
if (process.env.NODE_MODE === "production") {
  app.use(express.static(path.join(__dirnames, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirnames, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", async (req, res) => {
    res.send("API running");
  });
}

//fallback routes
app.use((req, res, next) => {
  const error = new Error(`Not found ${req.originalUrl}`);
  res.status(400);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(port, () => {
  console.log(`listening to server on ${port}`);
});

mongoose
  .connect(mongoDb, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
// readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
