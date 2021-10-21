const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/userModel");
const Order = require("../model/orderModel");

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Register a new User Account
const registerAccount = async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await User.find({ email: email.toLowerCase() });
  if (user && user.length > 0) {
    res.status(401).json({
      message: "User Email Already Exists",
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      });
      await newUser.save();
      res.status(200).json({
        ...newUser._doc,
        message: "Signup was successful!",
      });
    } catch (error) {
      res.status(500).json({
        message: "Signup failed!",
      });
    }
  }
};

// Login a User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email: email.toLowerCase() });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(password, user[0].password);

      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            _id: user[0]._id,
            name: user[0].name,
            email: user[0].email,
            image: user[0].image,
            role: user[0].role,
            provider: user[0].provider,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        res.status(200).json({
          access_token: token,
          message: "Login successful!",
        });
      } else {
        res.status(401).json({
          message: "Authentication failed!",
        });
      }
    } else {
      res.status(401).json({
        message: "Authentication failed!",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Authentication failed!",
    });
  }
};

// Social Login Provider
const loginUserWithSocialMedia = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.find({ email: email.toLowerCase() });
    if (user && user.length > 0) {
      const token = jwt.sign(
        {
          _id: user[0]._id,
          name: user[0].name,
          email: user[0].email,
          image: user[0].image,
          provider: user[0].provider,
          role: user[0].role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.status(200).json({
        access_token: token,
        message: "Login successful!",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Authentication failed!",
    });
    console.log(err);
  }
};

// Change User Role
const changeRole = async (req, res) => {
  const userID = req.params.id;

  try {
    await User.findByIdAndUpdate(userID, { role: req.body.role });
    res.json({ message: "Successfully Updated!" });
  } catch (error) {
    res.status(200).json({
      message: "Couldn't update the Account",
    });
  }
};

// Get Current User's Profile
const getProfile = async (req, res) => {
  const userID = req.userId;

  try {
    const currentUser = await User.findById(userID).populate("orders");
    res.json(currentUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Current User's Order History
const getOrderHistory = async (req, res) => {
  const username = req.username;
  try {
    const orders = await Order.find({ email: username });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Change Current User's Profile Photo
const updateProfilePhoto = async (req, res) => {
  const userID = req.userId;
  const image = req.file.path;

  try {
    const currentUser = await User.findById(userID);

    fs.unlink(currentUser.image, async (err) => {
      if (err)
        res.status(500).json({ message: "Couldn't update the profile photo!" });

      await User.findByIdAndUpdate(userID, {
        image,
      });
      res.json({ message: "Successfully uploaded new profile photo!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Couldn't update the profile photo!" });
  }
};

// Update Current User's Profile
const updateProfile = async (req, res) => {
  const userID = req.userId;
  const { name, address, country, state, zipcode, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userID, {
      name,
      address,
      phone,
      country,
      state,
      zipcode,
    });
    res.json({
      ...updatedUser._doc,
      name,
      address,
      phone,
      country,
      state,
      zipcode,
      message: "Successfully Updated!",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Change Current User's Password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);

    if (user) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (isValidPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.userId, { password: hashedPassword });
        res.json({ message: "Successfully Updated!" });
      } else {
        res.status(401).json({
          message: "Current Password doesn't match",
        });
      }
    } else {
      res.status(401).json({
        message: "User Not Found",
      });
    }
  } catch (err) {
    res.status(401).json({
      message: "Couldn't Change Password, Server Error Occurred",
    });
  }
};

// Reactivate Current User's Account
const reactivateUser = async (req, res) => {
  const userID = req.userId;

  try {
    await User.findByIdAndUpdate(userID, { status: "active" });
    res.json({ message: "Successfully Activated your Account!" });
  } catch (error) {
    res.status(401).json({
      message: "Couldn't Activate your Account",
    });
  }
};

// Deactivate Current User's Account
const deactivateUser = async (req, res) => {
  const userID = req.userId;

  try {
    await User.findByIdAndUpdate(userID, { status: "inactive" });
    res.json({ message: "Successfully Deactivated your Account!" });
  } catch (error) {
    res.status(401).json({
      message: "Couldn't Deactivate your Account",
    });
  }
};

module.exports = {
  getAllUsers,
  registerAccount,
  loginUser,
  loginUserWithSocialMedia,
  getProfile,
  getOrderHistory,
  updateProfilePhoto,
  updateProfile,
  changePassword,
  changeRole,
  reactivateUser,
  deactivateUser,
};
