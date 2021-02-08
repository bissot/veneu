const mongoose = require("mongoose");

const UserGroup = new mongoose.Schema(
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
    parent_resource: mongoose.Schema.Types.ObjectId,
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
    Promise.all([
      this.model("Auth").deleteMany({ resource: this._id }),
      this.model("Course").findByIdAndUpdate({ _id: this.parent_resource }, { $pull: { user_groups: this._id } }),
      this.model("UserGroup").findByIdAndUpdate({ _id: this.parent_resource }, { $pull: { user_groups: this._id } })
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
        this.model("Course").findByIdAndUpdate({ _id: this.parent_resource }, { $addToSet: { user_groups: this._id } }),
        this.model("UserGroup").findByIdAndUpdate(
          { _id: this.parent_resource },
          { $addToSet: { user_groups: this._id } }
        )
      ]);
    }
  });

module.exports = mongoose.model("UserGroup", UserGroup);
