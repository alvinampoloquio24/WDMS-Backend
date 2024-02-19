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
    type: String,
  },
  died: {
    type: String,
  },
  age: {
    type: String,
  },
  dateJoin: {
    type: Date,
    default: Date.now, // Setting default value to current date
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  daysAgo: {
    type: Number, // Change type to Number for storing days
  },
});

// Pre-save hook to calculate daysAgo
contributionSchema.pre("save", function (next) {
  // Calculate the difference in milliseconds between now and dateJoin
  const millisecondsDiff = Date.now() - this.dateJoin.getTime();
  // Convert milliseconds to days
  this.daysAgo = Math.floor(millisecondsDiff / (1000 * 60 * 60 * 24));
  next();
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;
