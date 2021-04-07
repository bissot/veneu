const mongoose = require("mongoose");

const Lecture = new mongoose.Schema(
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
      default: "Lecture"
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    parent_resource: mongoose.Schema.Types.ObjectId
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
)
  .pre("deleteOne", { document: true }, function(next) {
    Promise.all([
      mongoose.model("Auth").deleteMany({ shared_resource: this._id }),
      mongoose.model("RegistrationSection").updateOne({ _id: this.parent_resource }, { $pull: { lectures: this._id } }),
      mongoose.model("UserGroup").updateOne({ _id: this.parent_resource }, { $pull: { lectures: this._id } }),
      mongoose.model("Course").updateOne({ _id: this.parent_resource }, { $pull: { lectures: this._id } })
    ]).then(next);
  })
  .pre("save", function(next) {
    this.wasNew = this.isNew;
    next();
  })
  .post("save", function() {
    if (this.wasNew) {
      mongoose
        .model("Auth")
        .create({
          shared_resource: this._id,
          shared_resource_type: "Lecture",
          user: this.creator._id,
          role: "INSTRUCTOR"
        })
        .then(auth => {
          global.pubsub.publish("AUTH_CREATED", {
            authCreated: auth
          });
        });
    }
  });

module.exports = mongoose.model("Lecture", Lecture);
