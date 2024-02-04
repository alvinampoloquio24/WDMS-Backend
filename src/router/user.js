const express = require("express");
const {
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
  login,
} = require("../controllers/user");

const router = express.Router();

router.post("/createUser", createUser);
router.get("/fetchAllUser", getAllUser);
router.delete("/deleteUser/:id", deleteUser);
router.patch("/updateUser/:id", updateUser);
router.post("/login", login);
module.exports = router;
