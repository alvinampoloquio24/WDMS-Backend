const mongoose = require("mongoose");

// Define the schema for items in the recycle bin
const benefitciarySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  role: {
    type: String,
    default: "beneficiary",
    enum: ["beneficiary", "leader"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model for the recycle bin item
const Beneficiary = mongoose.model("Beneficiary", benefitciarySchema);

module.exports = Beneficiary;
