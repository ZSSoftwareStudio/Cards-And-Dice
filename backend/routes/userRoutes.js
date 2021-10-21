const express = require("express");
const {
  getAllUsers,
  registerAccount,
  loginUser,
  getProfile,
  getOrderHistory,
  updateProfilePhoto,
  updateProfile,
  changePassword,
  changeRole,
  deactivateUser,
  reactivateUser,
  loginUserWithSocialMedia,
} = require("../controllers/userController");
const checkLogin = require("../middlewares/checkLogin");
const checkIfAdmin = require("../middlewares/checkIfAdmin");
const upload = require("../utils/uploader")("users");

// User Routes
const router = express.Router();
router.get("/", checkIfAdmin, getAllUsers);
router.post("/login", loginUser);
router.post("/sociallogin", loginUserWithSocialMedia);
router.get("/profile", checkLogin, getProfile);
router.get("/orders", checkLogin, getOrderHistory);
router.post("/register", checkIfAdmin, registerAccount);
router.put(
  "/profilePhoto",
  [checkLogin, upload.single("image")],
  updateProfilePhoto
);
router.put("/profile", checkLogin, updateProfile);
router.put("/change-password", checkLogin, changePassword);
router.put("/:id/change-role", checkIfAdmin, changeRole);
router.put("/activate", checkLogin, reactivateUser);
router.put("/deactivate", checkLogin, deactivateUser);

module.exports = router;
