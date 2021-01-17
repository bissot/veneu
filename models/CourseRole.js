const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseRole = new Schema({
  role: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course"
  }
});

module.exports = mongoose.model("CourseRole", CourseRole);
