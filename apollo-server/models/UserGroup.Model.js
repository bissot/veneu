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
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    type: {
      type: String,
      default: "UserGroup"
    },
    parent_resource: mongoose.Schema.Types.ObjectId,
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
  .pre("deleteOne", { document: true }, function(next) {
    Promise.all([
      this.model("Auth").deleteMany({ resource: this._id }),
      this.model("Course").findByIdAndUpdate({ _id: this.parent_resource }, { $pull: { user_groups: this._id } }),
      this.model("UserGroup").findByIdAndUpdate({ _id: this.parent_resource }, { $pull: { user_groups: this._id } }),
      this.model("RegistrationSection").findByIdAndUpdate(
        { _id: this.parent_resource },
        { $pull: { user_groups: this._id } }
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
        this.model("Auth")
          .create({
            shared_resource: this._id,
            shared_resource_type: "UserGroup",
            user: this.creator._id,
            role: "INSTRUCTOR"
          })
          .then(auth => {
            global.pubsub.publish("AUTH_CREATED", {
              authCreated: auth
            });
          }),
        this.model("Course").findByIdAndUpdate({ _id: this.parent_resource }, { $addToSet: { user_groups: this._id } }),
        this.model("UserGroup").findByIdAndUpdate(
          { _id: this.parent_resource },
          { $addToSet: { user_groups: this._id } }
        ),
        this.model("RegistrationSection").findByIdAndUpdate(
          { _id: this.parent_resource },
          { $addToSet: { user_groups: this._id } }
        )
      ]);
    }
  });

module.exports = mongoose.model("UserGroup", UserGroup);
