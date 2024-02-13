const UserService = require("../services/user");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const getAllUser = async (req, res) => {
  try {
    const users = await UserService.getAllUser();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const deleteUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "User Id is required. " });
    }
    const users = await UserService.deleteUser(req.params.id);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const updateUser = async (req, res) => {
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
    return res.status(500).send(error);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await UserService.findByEmail(email);
    if (!existUser) {
      return res.status(400).json({ message: "Wrong email." });
    }
    const user = await UserService.login(email, password);
    if (!user) {
      return res.status(400).json({ message: "Wrong password. " });
    }
    const token = jsonwebtoken.sign(
      { _id: existUser._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRE }
    );
    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(500).send(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.user._id;
    if (!id) {
      return res.status(400).json({ message: "Id is required. " });
    }

    const user = await User.findById(id);
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
    const updatedUser = await User.findByIdAndUpdate(id, {
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
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = {
  changePassword,
  login,
  createUser,
  getAllUser,
  deleteUser,
  updateUser,
};
