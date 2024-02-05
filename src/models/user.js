const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = model("User", userSchema);
module.exports = User;
