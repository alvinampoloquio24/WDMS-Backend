const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config", ".env") });
const userRouter = require("./router/user");
const express = require("express");
const connectToDatabase = require("./config/database");
const cors = require("cors");
const Notification = require("./services/notification");
const cron = require("node-cron");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3001; // Default to 3001 if PORT is not specified in .env

const app = express();
app.use(cors());
app.use(express.json());
connectToDatabase();

cron.schedule("0 0 * * *", function () {
  const today = new Date(); // Get the current date
  console.log(today);
  Notification();
});

// Routes
app.post("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

// Use userRouter for "/user" routes
app.use(userRouter);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running`);
});
