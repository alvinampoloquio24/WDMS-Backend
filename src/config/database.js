// Import necessary modules
const mongoose = require("mongoose");
require("dotenv").config();

// Get the MongoDB connection string from environment variables
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Event handlers for the Mongoose connection
const db = mongoose.connection;

// On successful connection
db.on("connected", () => {
  console.log(`Connected to MongoDB at ${mongoURI}`);
});

// On connection error
db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// On disconnection
db.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Close the Mongoose connection when the Node process terminates
process.on("SIGINT", () => {
  db.close(() => {
    console.log("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
});
