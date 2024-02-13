const UserService = require("../services/user");
const bcrypt = require("bcrypt");
const User = require("../models/user");

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
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required. " });
    }
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "There is no user with this Id. " });
    }

    const newPassword = await bcrypt.hash(req.body.newPassword, 8);
    const updatedUser = await User.findByIdAndUpdate(id, {
      password: newPassword,
    });
    
    // Check if the user was updated successfully
    if (updatedUser) {
      return res.status(200).json({ message: "Password changed successfully." });
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
