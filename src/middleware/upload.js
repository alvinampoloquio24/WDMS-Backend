const multer = require("multer");

// Define the storage engine to store the uploaded files
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Define the file filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png|img|svg)$/)) {
    return cb(new Error("File type not supported"));
  }
  cb(null, true);
};

// Set the maximum file size allowed to upload
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// Initialize multer with the defined settings
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
