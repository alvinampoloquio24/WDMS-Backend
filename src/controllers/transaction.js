const TransactionService = require("../services/transaction");
const ContributionService = require("../services/contribution");
const Transactions = require("../models/transaction");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../email/email");

const makePayment = async (req, res, next) => {
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
    console.log(contribution, "aasdsa");
    if (!contribution) {
      return res
        .status(400)
        .json({ message: "There is no contribution in provided Id. " });
    }

    data.contribution = contribution;
    data.userId = userId;
    data.status = "Waiting for approval";

    const transaction = await TransactionService.makePayment(data);

    // await sendEmail(
    //   transaction.referenceNumber,
    //   contributionName,
    //   amount,
    //   transaction.date,
    //   data.email
    // );
    console.log(transaction);
    return res
      .status(201)
      .json({ message: "Successfully Paid. ", transaction });
  } catch (error) {
    return next(error);
  }
};
const getSelfTransaction = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transaction = await Transactions.find({ userId });
    return res.status(200).json(transaction);
  } catch (error) {
    return next(error);
  }
};
const editTransaction = async (req, res, next) => {
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
    return next(error);
  }
};
const deleteTransaction = async (req, res, next) => {
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
    return next(error);
  }
};
const getAllTransaction = async (req, res, next) => {
  try {
    const transactions = await TransactionService.getTransaction();
    return res.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
};
const getAllTransactionWithStatus = async (req, res, next) => {
  try {
    const status = req.query.status;

    const transactions = await TransactionService.getTransactionWithStatus(
      status
    );

    return res.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
};
const findReferenceNumber = async (req, res, next) => {
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
    return next(error);
  }
};
const getReport = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (from && to) {
      const report = await TransactionService.getReportWithParamas(from, to);
      return res.status(200).json(report);
    } else {
      const report = await TransactionService.getReport();
      return res.status(200).json(report);
    }
  } catch (error) {
    return next(error);
  }
};
const approveTransaction = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isPaid = await TransactionService.isPaid(id);
    if (isPaid) {
      return res
        .status(400)
        .json({ message: "Transaction is already approve. " });
    }
    const transaction = await TransactionService.approveTransaction(id);
    if (!transaction) {
      return res
        .status(400)
        .json({ message: "There is no transaction in provided Id. " });
    }

    return res.status(200).json({ message: "Approve Successfully. " });
  } catch (error) {
    return next(error);
  }
};
const getUnpaidUsers = async (req, res, next) => {
  try {
    const users = await ContributionService.getUserUnpaidContribution();

    return res.send(users);
  } catch (error) {
    return next(error);
  }
};
const Transaction = {
  getAllTransactionWithStatus,
  getAllTransaction,
  makePayment,
  getSelfTransaction,
  editTransaction,
  deleteTransaction,
  findReferenceNumber,
  getReport,
  approveTransaction,
  getUnpaidUsers,
};

module.exports = Transaction;
