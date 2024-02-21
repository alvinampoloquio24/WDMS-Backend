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
const Transaction = require("../controllers/transaction.js");
const router = express.Router();

router.post("/createUser", createUser);
router.get("/fetchAllUser", getAllUser);
router.delete("/deleteUser/:id", deleteUser);
router.patch("/updateUser/:id", updateUser);
router.post("/login", login);
router.post("/changePassword", auth, changePassword); // corrected typo here
// contribution
router.post("/addContribution", Contribution.addContribution);
router.get("/getContribution", auth, Contribution.getContribution);
router.get("/getContributionById/:id", auth, Contribution.getContributionById);
router.post("/editContribution/:id", Contribution.editContribution);
router.delete("/deleteContribution/:id", Contribution.deleteContribution);
//transaction
router.post("/makePayment/:id", auth, Transaction.makePayment);
router.get("/getSelfTransaction", auth, Transaction.getSelfTransaction);
router.post("/editTransaction/:id", auth, Transaction.editTransaction);
router.delete("/deleteTransaction/:id", auth, Transaction.deleteTransaction);
router.get("/getAllTransaction", auth, Transaction.getAllTransaction);
module.exports = router;
