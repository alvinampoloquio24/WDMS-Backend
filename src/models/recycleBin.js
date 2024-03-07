const mongoose = require("mongoose");

// Define the schema for items in the recycle bin
const recycleBinSchema = new mongoose.Schema({
  dataType: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model for the recycle bin item
const RecycleBin = mongoose.model("RecycleBin", recycleBinSchema);

module.exports = RecycleBin;
