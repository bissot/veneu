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
    auths: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
      }
    ],
    type: {
      type: String,
      default: "User"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
).pre("deleteOne", { document: true }, function(next) {
  Promise.all([
    this.model("Auth").deleteMany({ user: this._id }),
    this.model("Notification").deleteMany({ user: this._id })
  ]).then(next);
});

module.exports = mongoose.model("User", User);
