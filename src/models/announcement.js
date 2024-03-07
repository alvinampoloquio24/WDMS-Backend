const mongoose = require("mongoose");

// Define the schema for items in the recycle bin
const announcementSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model for the recycle bin item
const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
