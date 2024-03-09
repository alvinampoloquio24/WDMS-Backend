const UserService = require("../services/user");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
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
    const user = await UserService.deleteUser(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "Id not exist. " });
    }
    return res.status(200).json({ message: "Delete Successfully ", user });
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
    console.log(error);
    return res.status(500).send(error);
  }
};
const changePassword = async (req, res) => {
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
    console.log(error);
    return res.status(500).send(error);
  }
};
const readSelf = async function (req, res) {
  try {
    const id = req.user.id;
    const user = await UserService.findById(id);

    return res.status(200).json(user);
  } catch (error) {
    throw error;
  }
};
const updateSelf = async function (req, res) {
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
    throw error;
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
};
