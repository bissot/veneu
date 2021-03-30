const seeder = require("mongoose-seed");

seeder.connect(process.env.DB_URL, { useUnifiedTopology: true }, function () {
  seeder.loadModels([
    "./apollo-server/models/Auth.Model",
    "./apollo-server/models/Course.Model",
    "./apollo-server/models/Notification.Model",
    "./apollo-server/models/User.Model",
    "./apollo-server/models/UserGroup.Model",
  ]);
  seeder.clearModels(["Auth", "Course", "Notification", "User", "UserGroup"], function () {
    seeder.disconnect();
  });
});
