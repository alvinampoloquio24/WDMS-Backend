const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// Function to generate a unique reference number
function generateReferenceNumber() {
  // Logic to generate a unique reference number
  // This could use any method suitable for your application, e.g., UUID
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return "REF_" + currentDate + "_" + Math.random().toString(36).substr(2, 9);
}

const transactionSchema = new Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  amount: {
    type: String,
  },
  contribution: {
    type: Object,
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
  },
  paymentMethod: {
    type: String,
  },
  referenceNumber: {
    type: String,
    unique: true, // Ensures uniqueness of reference number
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to generate a reference number before saving
transactionSchema.pre("save", function (next) {
  if (!this.referenceNumber) {
    this.referenceNumber = generateReferenceNumber();
  }
  next();
});

const Transaction = model("Transaction", transactionSchema);
module.exports = Transaction;