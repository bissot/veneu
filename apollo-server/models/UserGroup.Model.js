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
    },
    user_groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserGroup"
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
      console.log("MONGODB", this);
      Promise.all([
        this.model("Auth").create({ shared_resource: this._id, user: this.creator, role: "INSTRUCTOR" }),
        this.model("Course").findByIdAndUpdate(
          { _id: this.parent_resource },
          { $addToSet: { user_groups: this._id } },
          { new: true }
        ),
        this.model("UserGroup").findByIdAndUpdate(
          { _id: this.parent_resource },
          { $addToSet: { user_groups: this._id } },
          { new: true }
        )
      ]).then(res => {
        console.log("MONGODB AFTER", res[0], res[1], res[2]);
      });
    }
  });

module.exports = mongoose.model("UserGroup", UserGroup);
