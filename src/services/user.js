const User = require("../models/user");
const bcrypt = require("bcrypt");
const TransactionService = require("./transaction");
const cloudinary = require("../config/cloudinary");
const RecycleBinService = require("./recycleBin");

async function createUser(userData, file) {
  try {
    userData.password = await bcrypt.hash(userData.password, 8);
    const user = await User.create(userData);

    let imageUrl;
    if (file) {
      const image = await cloudinary.uploader.upload(file);
      imageUrl = image.url;
    }

    const a = await TransactionService.makePayment({
      registrationFee: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      amount: 20,
      image: imageUrl || null,
      status: "Waiting for approval",
    });

    return user;
  } catch (error) {
    console.log(error);
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
    if (!user) {
      return null;
    }
    await RecycleBinService.create("User", user);
    return user;
  } catch (error) {
    console.log(error);
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
      if (user.inPenalty === true) {
        return {
          error: {
            message:
              "You are in penalty mode, contact the admin for more information",
          },
        };
      }
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
async function findByIdAndUpdate(id, update) {
  try {
    return await User.findByIdAndUpdate(id, update, { new: true });
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
  findByIdAndUpdate,
};
module.exports = UserService;
