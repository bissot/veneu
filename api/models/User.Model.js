// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  course_roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseRole"
    }
  ]
}).pre("remove", function(next) {
  this.model("CourseRole").remove({ user: this._id }, next);
});
// .pre("save", function() {
//   const hashedPassword = bcrypt.hashSync(this.password, 12);
//   this.password = hashedPassword;
// });

module.exports = mongoose.model("User", User);
