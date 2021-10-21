const express = require("express");
const {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const checkIfStaffOrAdmin = require("../middlewares/checkIfStaffOrAdmin");
const upload = require("../utils/uploader")("categories");

// Category Routes
const router = express.Router();
router.get("/", getCategories);
router.post("/", [checkIfStaffOrAdmin, upload.single("image")], addCategory);
router.put("/:id", [checkIfStaffOrAdmin, upload.single("image")], editCategory);
router.delete("/:id", checkIfStaffOrAdmin, deleteCategory);

module.exports = router;
