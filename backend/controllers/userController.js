const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../model/db");

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = db.emptyOrRows(await db.query(`SELECT * FROM Users`, []));
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

  const user = db.emptyOrRows(
    await db.query(`SELECT * FROM Users WHERE email=?`, [email.toLowerCase()])
  );
  if (user && user.length > 0) {
    res.status(401).json({
      message: "User Email Already Exists",
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        `INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?); `,
        [name, email, hashedPassword, role]
      );
      res.status(200).json({
        name,
        email,
        role,
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
    const user = db.emptyOrRows(
      await db.query(`SELECT * FROM Users WHERE email=?`, [email.toLowerCase()])
    );
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(password, user[0].password);

      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          {
            _id: user[0].id,
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
    const user = db.emptyOrRows(
      await db.query(`SELECT * FROM Users WHERE email=?`, [email.toLowerCase()])
    );
    if (user && user.length > 0) {
      const token = jwt.sign(
        {
          _id: user[0].id,
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
    await db.query("UPDATE Users SET role=? WHERE id=?", [
      req.body.role,
      userID,
    ]);
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
    const currentUser = db.emptyOrRows(
      await db.query(`SELECT * FROM Users WHERE id=?`, [userID])
    );
    res.json(currentUser[0]);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Current User's Order History
const getOrderHistory = async (req, res) => {
  const username = req.username;
  try {
    const orders = db.emptyOrRows(
      await db.query(`SELECT * FROM Orders WHERE email=?`, [username])
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Change Current User's Profile Photo
const updateProfilePhoto = async (req, res) => {
  const userID = req.userId;
  const image = req.file.path;

  console.log(userID, image);

  try {
    const currentUser = db.emptyOrRows(
      await db.query(`SELECT * FROM Users WHERE id=?`, [userID])
    );

    if (currentUser.length !== 0) {
      if (currentUser[0].image !== "public/users/default-avatar.png") {
        fs.unlink(currentUser[0].image, async (err) => {
          if (err)
            res
              .status(500)
              .json({ message: "Couldn't update the profile photo!" });

          await db.query("UPDATE Users SET image=? WHERE id=?", [
            image,
            userID,
          ]);
          res.json({ message: "Successfully uploaded new profile photo!" });
        });
      } else {
        await db.query("UPDATE Users SET image=? WHERE id=?", [image, userID]);
        res.json({ message: "Successfully uploaded new profile photo!" });
      }
    } else {
      res.json({ message: "No User Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Couldn't update the profile photo!" });
  }
};

// Update Current User's Profile
const updateProfile = async (req, res) => {
  const userID = req.userId;
  const { name, address, country, state, zipcode, phone } = req.body;

  try {
    await db.query(
      "UPDATE Users SET name=?, address=?, country=?, state=?, zipcode=?, phone=? WHERE id=?",
      [name, address, country, state, zipcode, phone, userID]
    );
    res.json({
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
  const userID = req.userId;

  try {
    const user = db.emptyOrRows(
      await db.query(`SELECT * FROM Users WHERE id=?`, [userID])
    );

    if (user.length !== 0) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user[0].password
      );

      if (isValidPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE Users SET password=? WHERE id=?", [
          hashedPassword,
          userID,
        ]);
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
    await db.query("UPDATE Users SET status=? WHERE id=?", ["active", userID]);
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
    await db.query("UPDATE Users SET status=? WHERE id=?", [
      "inactive",
      userID,
    ]);
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
