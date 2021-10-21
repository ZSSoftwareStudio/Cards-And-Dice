const express = require("express");
const {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  changeImage,
} = require("../controllers/productController");
const checkIfStaffOrAdmin = require("../middlewares/checkIfStaffOrAdmin");
const upload = require("../utils/uploader")("products");

// Product Routes
const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", [checkIfStaffOrAdmin, upload.single("image")], addProduct);
router.put("/:id", checkIfStaffOrAdmin, editProduct);
router.put(
  "/:id/changeImage",
  [checkIfStaffOrAdmin, upload.single("image")],
  changeImage
);
router.delete("/:id", checkIfStaffOrAdmin, deleteProduct);

module.exports = router;
