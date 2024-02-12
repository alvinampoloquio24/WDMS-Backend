const express = require("express");
const {
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
  login,
  changePassword,
} = require("../controllers/user");

const router = express.Router();

router.post("/createUser", createUser);
router.get("/fetchAllUser", getAllUser);
router.delete("/deleteUser/:id", deleteUser);
router.patch("/updateUser/:id", updateUser);
router.post("/login", login);
router.post("/changePassword/:id", changePassword);
module.exports = router;
