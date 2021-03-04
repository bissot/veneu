const mongoose = require("mongoose");

const Auth = new mongoose.Schema(
  {
    role: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    shared_resource: mongoose.Schema.Types.ObjectId,
    shared_resource_type: String,
    type: {
      type: String,
      default: "Auth"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
)
  .pre("remove", function(next) {
    Promise.all([
      this.model("User").findByIdAndUpdate({ _id: this._id }, { $pull: { auths: this._id } }),
      this.model(this.shared_resource_type).findByIdAndUpdate({ _id: this._id }, { $pull: { auths: this._id } })
    ]).then(next);
  })
  .pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
  })
  .post("save", function() {
    if (this.wasNew) {
      Promise.all([
        this.model("User").findByIdAndUpdate({ _id: this.user }, { $addToSet: { auths: this._id } }),
        this.model(this.shared_resource_type).findByIdAndUpdate(
          { _id: this.shared_resource },
          { $addToSet: { auths: this._id } }
        )
      ]);
    }
  });

module.exports = mongoose.model("Auth", Auth);
