const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Course = new Schema({
  name: String,
  prefix: String,
  suffix: Number
});

module.exports = mongoose.model("Course", Course);
