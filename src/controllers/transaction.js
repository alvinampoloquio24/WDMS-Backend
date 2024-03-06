const TransactionService = require("../services/transaction");
const ContributionService = require("../services/contribution");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../email/email");

const makePayment = async (req, res) => {
  try {
    const id = req.params.id;
    let data = req.body;
    const userId = req.user._id;
    const isPaid = await TransactionService.findPayment(userId, id);

    if (req.file && req.file.path) {
      // Check if req.file exists before accessing its path
      const image = await cloudinary.uploader.upload(req.file.path);
      data.image = image.url;
    }
    if (isPaid) {
      return res.status(400).json({ message: "Your are already paid. " });
    }
    const contribution = await ContributionService.findContributionById(id);
    if (!contribution) {
      return res
        .status(400)
        .json({ message: "There is no contribution in provided Id. " });
    }
    const contributionName = `${contribution.lastName} ${contribution.firstName}`;
    const amount = contribution.amount;
    data.contribution = contribution;
    data.userId = userId;
    data.amount = contribution.amount;

    const transaction = await TransactionService.makePayment(data);

    await sendEmail(
      transaction.referenceNumber,
      contributionName,
      amount,
      transaction.date,
      data.email
    );
    return res
      .status(201)
      .json({ message: "Successfully Paid. ", transaction });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getSelfTransaction = async (req, res) => {
  try {
    const params = { userId: req.user._id };
    const transaction = await TransactionService.getTransaction(params);
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const editTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Transaction Id is required. " });
    }
    const transaction = await TransactionService.editTransaction(id, req.body);
    if (!transaction) {
      return res
        .status(400)
        .json({ message: "There is no transaction in provided Id. " });
    }
    return res
      .status(200)
      .json({ message: "Update Successfully. ", transaction });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Transaction Id is required. " });
    }
    const transaction = await TransactionService.deleteTransaction(id);
    if (!transaction) {
      return res
        .status(400)
        .json({ message: "There is no transaction in provided Id. " });
    }
    return res
      .status(200)
      .json({ message: "Delete Successfully. ", transaction });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getAllTransaction = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({ messase: "Unathorize Request. " });
    }
    const transactions = await TransactionService.getTransaction();

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const findReferenceNumber = async (req, res) => {
  try {
    const refNumber = req.params.number;
    if (!refNumber) {
      return res
        .status(400)
        .json({ message: "Reference number is required. " });
    }
    const reference = await TransactionService.findReferenceNumber(refNumber);
    if (!reference) {
      return res.status(400).json({ message: "Reference not found. " });
    }
    return res.status(200).json(reference);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const report = await TransactionService.getReport(from, to);

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const approveTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await TransactionService.approveTransaction(id);
    if (!transaction) {
      return res
        .status(400)
        .json({ message: "There is no transaction in provided Id. " });
    }

    return res.status(200).json({ message: "Approve Successfully. " });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const Transaction = {
  getAllTransaction,
  makePayment,
  getSelfTransaction,
  editTransaction,
  deleteTransaction,
  findReferenceNumber,
  getReport,
  approveTransaction,
};

module.exports = Transaction;
