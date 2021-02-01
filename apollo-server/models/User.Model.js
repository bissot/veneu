const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
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
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: false
    },
    course_roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseRole"
      }
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
      }
    ]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
).pre("remove", function(next) {
  Promise.all([
    this.model("CourseRole").deleteMany({ user: this._id }),
    this.model("Notification").deleteMany({ user: this._id })
  ]).then(next);
});

module.exports = mongoose.model("User", User);
