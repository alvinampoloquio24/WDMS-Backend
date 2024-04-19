const UserService = require("../services/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const Transaction = require("../models/transaction");
const Beneficiary = require("../models/benefiiciary");
const createUser = async (req, res, next) => {
  try {
    console.log(req.body, "-------------");
    const isEmailExist = await UserService.findByEmail(req.body.email);
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already used. " });
    }
    let file;
    if (req.file && req.file.path) {
      file = req.file.path;
    }

    // Check if req.file exists before accessing its path
    const user = await UserService.createUser(req.body, file);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};
const getAllUser = async (req, res, next) => {
  try {
    // Extract query parameters
    const { name } = req.query;

    // Initialize the filter regex if provided
    let filter = {};
    if (name) {
      filter.$or = [
        { firstName: new RegExp(name, "i") },
        { lastName: new RegExp(name, "i") },
      ];
    }

    // Fetch users based on filter
    const users = await User.find(filter);

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};
const getAllUser2 = async (req, res, next) => {
  try {
    const [a, beneficiaries] = await Promise.all([
      UserService.getAllUser2(),
      Beneficiary.find({ role: "beneficiary" })
        .sort({ lastName: 1 })
        .select({ _id: 1, lastName: 1, firstName: 1 }),
    ]);
    const users = a.concat(beneficiaries);
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "User Id is required. " });
    }
    const user = await UserService.deleteUser(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "Id not exist. " });
    }
    return res.status(200).json({ message: "Delete Successfully ", user });
  } catch (error) {
    return next(error);
  }
};
const updateUser = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "User Id is required. " });
    }
    const userExist = await UserService.findById(req.params.id);
    if (!userExist) {
      return res.status(400).json({ message: "No accont with this id. " });
    }
    const users = await UserService.updateUser(req.params.id, req.body);
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existUser = await UserService.findByEmail(email);
    if (!existUser) {
      return res.status(400).json({ message: "Wrong email." });
    }
    const user = await UserService.login(email, password);

    if (!user) {
      return res.status(400).json({ message: "Wrong password. " });
    } else if (user.error) {
      return res.status(400).json({ message: user.error.message });
    }
    const token = jsonwebtoken.sign(
      { _id: existUser._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE }
    );
    return res.status(200).json({ user, token });
  } catch (error) {
    return next(error);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const id = req.user._id;
    if (!id) {
      return res.status(400).json({ message: "Id is required. " });
    }
    const user = await UserService.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "There is no user with this Id. " });
    }

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password. " });
    }

    const newPassword = req.body.newPassword;
    if (!newPassword) {
      return res.status(400).json({ message: "New Password is required. " });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    const updatedUser = await UserService.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    // Check if the user was updated successfully
    if (updatedUser) {
      return res
        .status(200)
        .json({ message: "Password changed successfully." });
    } else {
      return res.status(400).json({ message: "Failed to change password." });
    }
  } catch (error) {
    return next(error);
  }
};
const readSelf = async function (req, res, next) {
  try {
    const id = req.user.id;
    const user = await UserService.findById(id);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
const updateSelf = async function (req, res, next) {
  try {
    const id = req.user.id;
    const update = req.body;
    if (update.role) {
      return res
        .status(400)
        .json({ message: "Updates must not incude the role. " });
    }
    const user = await UserService.findByIdAndUpdate(id, update);

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
const advancePayment = async function (req, res, next) {
  try {
    const id = req.user._id;
    const amountToAdd = Number(req.body.amount); // Assuming the amount comes from request body and converting it to Number

    // Find user and update balance atomically
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $inc: { balance: amountToAdd } }, // Increment user's balance
      { new: true, select: "balance" } // Return the updated document with only the balance field
    );

    const a = await Transaction.create({
      advance: { userId: id, amount: req.body.amount },
    });

    // Return success response
    return res.status(200).json({
      message: "Advance payment successful",
      totalBalance: updatedUser.balance,
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    return next(error);
  }
};
const getAdvcanceHistory = async function (req, res, next) {
  try {
    const id = req.user._id;

    const history = await Transaction.find({ "advance.userId": id });

    return res.status(200).json(history);
  } catch (error) {
    // Pass the error to the error handling middleware
    return next(error);
  }
};
const getBalance = async function (req, res, next) {
  try {
    const id = req.user._id;

    // Assuming 'advance' is a boolean indicating whether a transaction is an advance
    // Adjust the value of 'advance' in the query as needed based on your actual data model
    const balance = await User.findById(id);

    // Return success response
    return res.status(200).json({ balance: balance.balance });
  } catch (error) {
    // Pass the error to the error handling middleware
    return next(error);
  }
};

module.exports = {
  changePassword,
  login,
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
  readSelf,
  updateSelf,
  advancePayment,
  getAdvcanceHistory,
  getBalance,
  getAllUser2,
};
