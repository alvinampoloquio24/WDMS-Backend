const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  born: {
    type: Date,
  },
  died: {
    type: Date,
  },
  age: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  deadLine: {
    type: Date,
  },
  countDown: {
    type: Number,
  },
  daysAgo: {
    type: Number,
  },
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
