const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  born: {
    type: Date,
  },
  died: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  age: {
    type: String,
  },
  status: {
    type: String,
    enum: ["paid", "Waiting for approval", "pending"],
  },
  deadLine: {
    type: Date,
  },
  countDown: {
    type: Number,
  },
  release: {
    type: {
      claim: String,
      relation: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  },
  total: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true, // Add index to enable sorting
  },
  createdAt: { type: Date, default: Date.now },
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
