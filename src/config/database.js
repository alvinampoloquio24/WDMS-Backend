const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGODB_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URL, {
      // Remove useNewUrlParser and useUnifiedTopology, as they are deprecated
      serverSelectionTimeoutMS: 5000,
      // Add any additional options as needed
    });

    mongoose.connection.on("connected", () => {
      console.log("Database connected!");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connecting to the database:", err);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
}

// Export the connectToDatabase function
module.exports = connectToDatabase;
