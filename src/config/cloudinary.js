const cloudinary = require("cloudinary").v2;
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", "config", ".env"),
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.COUDINARY_API_KEY,
  api_secret: process.env.COUDINARY_SECRET_KEY,
});

module.exports = cloudinary;
