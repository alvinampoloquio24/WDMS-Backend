const express = require("express");
const upload = require("../middleware/upload");
const RecycleBin = require("../controllers/recycleBin.js");
const {
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
  login,
  changePassword,
  readSelf,
  updateSelf,
} = require("../controllers/user");
const auth = require("../middleware/auth");
const Contribution = require("../controllers/contribution.js");
const Transaction = require("../controllers/transaction.js");
const permission = require("../middleware/permission");
const Announcement = require("../controllers/announcement.js");
const router = express.Router();

//USER
router.post("/login", login);
router.get("/readSelf", auth, permission("readSelf", "User"), readSelf);
router.post("/updateSelf", auth, permission("updateSelf", "User"), updateSelf);
router.post("/changePassword", auth, changePassword);

router.post("/createUser", upload.single("image"), createUser);
router.get("/fetchAllUser", auth, permission("read", "User"), getAllUser);
router.delete(
  "/deleteUser/:id",
  auth,
  permission("delete", "User"),
  deleteUser
);
router.patch("/updateUser/:id", auth, permission("update", "User"), updateUser);

// CONTRIBUTION
router.get(
  "/getContribution",
  auth,
  permission("read", "Contribution"),
  Contribution.getContribution
);
router.get(
  "/getContributionById/:id",
  auth,
  permission("read", "Contribution"),
  Contribution.getContributionById
);
//admin
router.get(
  "/getAllContribution",
  auth,
  permission("readAll", "Contribution"),
  Contribution.getAllContribution
);
router.post(
  "/addContribution",
  auth,
  permission("create", "Contribution"),
  Contribution.addContribution
);
router.post(
  "/editContribution/:id",
  auth,
  permission("update", "Contribution"),
  Contribution.editContribution
);
router.delete(
  "/deleteContribution/:id",
  auth,
  permission("delete", "Contribution"),
  Contribution.deleteContribution
);

//TRANSACTION
router.post(
  "/makePayment/:id",
  auth,
  permission("create", "Transaction"),
  upload.single("image"),
  Transaction.makePayment
);
router.get(
  "/getSelfTransaction",
  auth,
  permission("readSelf", "Transaction"),
  Transaction.getSelfTransaction
);
router.post(
  "/editTransaction/:id",
  auth,
  permission("edit", "Transaction"),
  Transaction.editTransaction
);
router.delete(
  "/deleteTransaction/:id",
  auth,
  permission("delete", "Transaction"),
  Transaction.deleteTransaction
);
router.get(
  "/getAllTransaction",
  auth,
  permission("read", "Transaction"),
  Transaction.getAllTransaction
);
router.get(
  "/findReference/:number",
  auth,
  permission("read", "Transaction"),
  Transaction.findReferenceNumber
);
router.get(
  "/getReport",
  auth,
  permission("createReport", "Transaction"),
  Transaction.getReport
);
router.post(
  "/approveTransaction/:id",
  auth,
  permission("edit", "Transaction"),
  Transaction.approveTransaction
);

//RECYCLE BIN
router.delete(
  "/permanentDelete/:id",
  auth,
  permission("delete", "RecycleBin"),
  RecycleBin.permanentDelete
);
router.get(
  "/getAll",
  auth,
  permission("read", "RecycleBin"),
  RecycleBin.findAll
);
router.post(
  "/restore/:id",
  auth,
  permission("edit", "RecycleBin"),
  RecycleBin.restoreData
);

//Announcement

router.get(
  "/getAnnouncement",
  auth,
  // permission("read", "Announcement"),
  Announcement.getAnnouncement
);

module.exports = router;
