const mongoose = require("mongoose");

const RegistrationSection = new mongoose.Schema(
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
      default: "RegistrationSection"
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    user_groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserGroup"
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
      this.model("Auth").deleteMany({ resource: this._id }),
      this.model("Course").findByIdAndUpdate(
        { _id: this.parent_resource },
        { $pull: { registration_sections: this._id } }
      ),
      this.model("UserGroup").deleteMany({ _id: { $in: this.user_groups } }),
      this.model("Lecture").deleteMany({ parent_resource: this._id })
    ]).then(next);
  })
  .pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
  })
  .post("save", function() {
    if (this.wasNew) {
      Promise.all([
        this.model("Auth").create({ shared_resource: this._id, user: this.creator, role: "INSTRUCTOR" }),
        this.model("Course").findByIdAndUpdate({ _id: this.course }, { $addToSet: { registration_sections: this._id } })
      ]);
    }
  });

module.exports = mongoose.model("RegistrationSection", RegistrationSection);
