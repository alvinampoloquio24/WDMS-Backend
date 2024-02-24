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

// Pre-save hook to calculate due date based on deadline
contributionSchema.pre("save", function (next) {
  if (!this.deadLine) {
    return next(new Error("Deadline is required."));
  }

  // Assuming 'daysAgo' is the number of days before the deadline
  const daysBeforeDeadline = this.daysAgo || 0;

  // Calculate due date
  const dueDate = new Date(this.deadLine);
  dueDate.setDate(dueDate.getDate() - daysBeforeDeadline);

  // Calculate countDown (number of days remaining until the due date)
  const currentDate = new Date();
  let countDown = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  if (countDown <= 0) {
    countDown = 0;
  }
  this.countDown = countDown;

  next();
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
