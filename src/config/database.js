const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      // Add any additional options as needed
    });

    mongoose.connection.on("connected", () => {
      console.log("Database connected!");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connecting to database:", err);
    });
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
}

// Export the connectToDatabase function
module.exports = connectToDatabase;
