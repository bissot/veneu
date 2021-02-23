const mongoose = require("mongoose");

const Course = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    auths: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
      }
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      default: "Course"
    },
    prefix: {
      type: String,
      required: true
    },
    suffix: {
      type: Number,
      required: true
    },
    user_groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserGroup"
      }
    ],
    registration_sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistrationSection"
      }
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
      }
    ]
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
)
  .pre("remove", function(next) {
    Promise.all([
      this.model("Auth").deleteMany({ shared_resource: this._id }),
      this.model("UserGroup").deleteMany({ parent_resource: this._id }),
      this.model("RegistrationSection").deleteMany({ parent_resource: this._id }),
      this.model("Lecture").deleteMany({ parent_resource: this._id })
    ]).then(next);
  })
  .pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
  })
  .post("save", function() {
    if (this.wasNew) {
      this.model("Auth").create({ shared_resource: this._id, user: this.creator._id, role: "INSTRUCTOR" });
    }
  });
// .pre("remove", function(next) {
//   this.model("CourseRole").deleteMany({ course: this._id }, next);
// });

module.exports = mongoose.model("Course", Course);
