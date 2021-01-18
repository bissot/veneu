const mongoose = require("mongoose");

const CourseRole = new mongoose.Schema({
  role: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }
});

module.exports = mongoose.model("CourseRole", CourseRole);
