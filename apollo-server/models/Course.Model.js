const mongoose = require("mongoose");

const Course = new mongoose.Schema(
  {
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
).pre("remove", function(next) {
  this.model("CourseRole").remove({ course: this._id }, next);
});

module.exports = mongoose.model("Course", Course);
