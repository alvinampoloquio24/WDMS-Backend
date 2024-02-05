const express = require("express");
const {
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
  login,
} = require("../controllers/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/createUser", createUser);
router.get("/fetchAllUser", auth, getAllUser);
router.delete("/deleteUser/:id", deleteUser);
router.patch("/updateUser/:id", updateUser);
router.post("/login", login);
module.exports = router;
