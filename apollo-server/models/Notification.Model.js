const mongoose = require("mongoose");

const Notification = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    redirect: {
      type: String,
      required: true
    },
    seen: {
      type: Boolean,
      required: true,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
)
  .pre("remove", function(next) {
    this.model("User").findByIdAndUpdate({ _id: this.user }, { $pull: { notifications: this._id } }, next);
  })
  .pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
  })
  .post("save", function() {
    if (this.wasNew) {
      Promise.all([
        this.model("User").findOneAndUpdate({ _id: this.user }, { $addToSet: { notifications: this._id } })
      ]);
    }
  });

module.exports = mongoose.model("Notification", Notification);
