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
    enum: ["member", "admin", "cashier"],
    default: "member",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  password: {
    type: String,
  },
  registrationFee: {
    type: String,
    enum: ["gcash", "cash"],
  },
  inPenalty: {
    type: Boolean,
    default: false,
  },
  dateJoin: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);
module.exports = User;
