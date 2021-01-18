const mongoose = require("mongoose");

const Course = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  suffix: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Course", Course);
