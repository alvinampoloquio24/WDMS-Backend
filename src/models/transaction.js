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
  email: {
    type: String,
  },
  number: {
    type: String,
  },
  contribution: {
    type: {
      _id: {
        type: String,
      },
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
      age: {
        type: String,
      },
    },
  },
  registrationFee: {
    type: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  },
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    enum: ["paid", "Waiting for approval"],
    default: "Waiting for approval",
  },
  amount: {
    type: Number,
  },
  image: {
    type: String,
    default: null,
  },
  referenceNumber: {
    type: String,
    unique: true,
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
