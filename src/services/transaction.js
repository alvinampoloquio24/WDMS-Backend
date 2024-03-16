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
async function getTransaction() {
  try {
    return await Transaction.find();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getTransactionWithStatus(status) {
  try {
    return await Transaction.find({ status });
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
async function findAllTransaction(key) {
  try {
    console.log(key, "asd");
    if (key) {
      return await Transaction.find(key);
    } else {
      const t = await Transaction.find();
      console.log(t);
    }
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
async function getReport() {
  try {
    const transactions = await Transaction.find();

    let paid = 0,
      waitingForApproval = 0;

    transactions.forEach((transaction) => {
      if (transaction.status === "paid") {
        paid++;
      } else {
        waitingForApproval++;
      }
    });

    let totalAmount = 0;
    transactions.forEach((transaction) => {
      totalAmount += transaction.amount;
    });

    const remainingMembers = await User.countDocuments();

    const report = {
      totalAmount: totalAmount,
      totalNumberMember: remainingMembers,
      transactions: {
        paid,
        waitingForApproval,
      },
    };
    return report;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function getReportWithParamas(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setDate(toDate.getDate() + 1);

  const transactions = await Transaction.find({
    date: {
      $gte: fromDate,
      $lt: toDate,
    },
  });

  let paid = 0,
    waitingForApproval = 0;

  transactions.forEach((transaction) => {
    if (transaction.status === "paid") {
      paid++;
    } else {
      waitingForApproval++;
    }
  });

  const newMembers = await User.find({
    dateJoin: {
      $gte: fromDate,
      $lt: toDate,
    },
  });
  const newMembersCount = newMembers.length;

  let totalAmount = 0;
  transactions.forEach((transaction) => {
    totalAmount += transaction.amount;
  });

  const remainingMembers = await User.countDocuments();

  const report = {
    message: `Report from ${from} to ${to}`,
    totalAmount: totalAmount,
    newMembers: newMembersCount,
    totalNumberMember: remainingMembers,
    transactions: {
      paid,
      waitingForApproval,
    },
  };
  return report;
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
  findAllTransaction,
  getReportWithParamas,
  getTransactionWithStatus,
};

module.exports = TransactionService;
