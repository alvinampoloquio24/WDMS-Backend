const express = require("express");
const {
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
  login,
  changePassword,
} = require("../controllers/user");
const auth = require("../middleware/auth");
const Contribution = require("../controllers/contribution.js");

const router = express.Router();

router.post("/createUser", createUser);
router.get("/fetchAllUser", getAllUser);
router.delete("/deleteUser/:id", deleteUser);
router.patch("/updateUser/:id", updateUser);
router.post("/login", login);
router.post("/changePassword", auth, changePassword); // corrected typo here
// contribution
router.post("/addContribution", Contribution.addContribution);
router.get("/getContribution", Contribution.getContribution);
router.post("/editContribution/:id", Contribution.editContribution);
router.delete("/deleteContribution/:id", Contribution.deleteContribution);
module.exports = router;
