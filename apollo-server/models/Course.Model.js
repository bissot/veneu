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
    auths: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
      }
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
)
  .pre("remove", function(next) {
    this.model("Auth").deleteMany({ shared_resource: this._id }, next);
    this.model("UserGroup").deleteMany({ parent_resource: this._id }, next);
  })
  .pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
  })
  .post("save", function() {
    if (this.wasNew) {
      this.model("Auth").create({ shared_resource: this._id, user: this.creator, role: "INSTRUCTOR" });
    }
  });
// .pre("remove", function(next) {
//   this.model("CourseRole").deleteMany({ course: this._id }, next);
// });

module.exports = mongoose.model("Course", Course);
