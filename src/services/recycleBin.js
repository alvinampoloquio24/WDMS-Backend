const RecycleBin = require("../models/recycleBin");
const Contribution = require("../models/contribution");
const User = require("../models/user");
const transaction = require("../models/transaction");

const create = async function (dataType, data) {
  try {
    return await RecycleBin.create({ dataType, data });
  } catch (error) {
    throw error;
  }
};
const retriveData = async function (id) {
  try {
    const bin = await RecycleBin.findById(id);
    if (!bin) {
      return null;
    }
    const { data, dataType } = bin;
    let Model;

    if (dataType === "User") {
      Model = User;
    } else if (dataType === "Contribution") {
      Model = Contribution;
    } else if (dataType === "transaction") {
      Model = transaction;
    }
    const restore = await Model.create(data);
    await permanentDelete(id);
    return restore;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const findById = async function (id) {
  try {
    return await RecycleBin.findById(id);
  } catch (error) {
    throw error;
  }
};
const findAll = async function (params) {
  try {
    if (params) {
      return await RecycleBin.find({ dataType: params });
    } else {
      return await RecycleBin.find();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const permanentDelete = async function (id) {
  try {
    const data = await RecycleBin.findByIdAndDelete(id);
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    throw error;
  }
};
const RecycleBinService = {
  create,
  retriveData,
  findById,
  findAll,
  permanentDelete,
};
module.exports = RecycleBinService;
