const Transaction = require("../models/transaction.js");
const { ObjectId } = require("mongodb");
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
    return await Transaction.find(params);
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
    return await Transaction.findByIdAndDelete(id);
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
const TransactionService = {
  findReferenceNumber,
  deleteTransaction,
  editTransaction,
  getTransaction,
  makePayment,
  findPayment,
  findTransaction,
};

module.exports = TransactionService;
