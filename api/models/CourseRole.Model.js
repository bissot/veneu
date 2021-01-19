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
})
  .pre("remove", function(next) {
    Promise.all([
      this.model("User").findOneAndUpdate(
        { _id: this._id },
        { $pull: { course_roles: this._id } }
      ),
      this.model("Course").findOneAndUpdate(
        { _id: this._id },
        { $pull: { course_roles: this._id } }
      )
    ]).then(next);
  })
  .post("save", function(next) {
    if (this.isNew) {
      Promise.all([
        this.model("User").findOneAndUpdate(
          { _id: this.user },
          { $addToSet: { course_roles: this._id } }
        ),
        this.model("Course").findOneAndUpdate(
          { _id: this.course },
          { $addToSet: { course_roles: this._id } }
        )
      ]).then(next);
    } else {
      next();
    }
  });

module.exports = mongoose.model("CourseRole", CourseRole);
