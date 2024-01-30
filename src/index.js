const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config", ".env") });

const express = require("express");

const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello, this is your Express server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
