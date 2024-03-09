const { ObjectId } = require("mongodb");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const RecycleBinService = require("./recycleBin");

async function makePayment(data) {
  try {
    return await Transaction.create(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getTransaction(params) {
  try {
    if (params) {
      return await Transaction.find(params);
    }
    return await Transaction.find();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function findPayment(id, contributionId) {
  try {
    return await Transaction.findOne({
      userId: id,
      "contribution._id": ObjectId.createFromHexString(contributionId),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function editTransaction(id, update) {
  try {
    return await Transaction.findByIdAndUpdate(id, update, { new: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function deleteTransaction(id) {
  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return null;
    }
    await RecycleBinService.create("Transaction", transaction);
    return transaction;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function findTransaction(params) {
  try {
    return await Transaction.findOne(params);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function findReferenceNumber(refNumber) {
  try {
    return await Transaction.findOne({ referenceNumber: refNumber });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function isPaid(id) {
  try {
    return await Transaction.findOne({ _id: id, status: "paid" });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getReport(from, to) {
  try {
    // Convert string dates to Date objects
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Adjust toDate to include transactions up to the end of the 'to' day
    toDate.setDate(toDate.getDate() + 1);

    // Query transactions within the date range
    const transactions = await Transaction.find({
      date: {
        $gte: fromDate,
        $lt: toDate,
      },
      status: "paid",
    });

    // Query new members within the date range based on the dateJoin field
    const newMembers = await User.find({
      dateJoin: {
        $gte: fromDate,
        $lt: toDate,
      },
    });

    // Calculate total amount
    let totalAmount = 0;
    transactions.forEach((transaction) => {
      totalAmount += transaction.amount;
    });

    // Calculate the number of new members
    const newMemberCount = newMembers.length;

    // Calculate the number of remaining members
    const remainingMembers = await User.countDocuments();

    const report = {
      totalAmountOfContribution: totalAmount,
      newMembers: newMemberCount,
      remainingMembers: remainingMembers,
    };
    return report;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function approveTransaction(id) {
  try {
    return await Transaction.findByIdAndUpdate(id, { status: "paid" });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const TransactionService = {
  findReferenceNumber,
  deleteTransaction,
  editTransaction,
  getTransaction,
  makePayment,
  findPayment,
  findTransaction,
  getReport,
  approveTransaction,
  isPaid,
};

module.exports = TransactionService;
