const mongoose = require("mongoose");

const Course = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  suffix: {
    type: Number,
    required: true
  },
  course_roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseRole"
    }
  ]
});

module.exports = mongoose.model("Course", Course);
