const User = require("../models/user");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  try {
    userData.password = await bcrypt.hash(userData.password, 8);
    return await User.create(userData);
  } catch (error) {
    throw error;
  }
}

async function getAllUser() {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw error;
  }
}
async function deleteUser(id) {
  try {
    const user = await User.findByIdAndDelete(id);
    return user;
  } catch (error) {
    throw error;
  }
}
async function findById(id) {
  try {
    return await User.findOne({ _id: id });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateUser(id, userInfo) {
  try {
    if (userInfo.password) {
      userInfo.password = await bcrypt.hash(userInfo.password, 8);
    }
    return await User.findByIdAndUpdate(id, userInfo, { new: true });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function login(email, password) {
  try {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function findByEmail(email) {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const UserService = {
  getAllUser,
  createUser,
  deleteUser,
  updateUser,
  findById,
  login,
  findByEmail,
};
module.exports = UserService;
