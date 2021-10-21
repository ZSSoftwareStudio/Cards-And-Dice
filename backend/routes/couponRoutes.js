const express = require("express");
const {
  getAllCoupons,
  addCoupon,
  deleteCoupon,
  getCoupon,
} = require("../controllers/couponControllers");
const router = express.Router();
const checkIfStaffOrAdmin = require("../middlewares/checkIfStaffOrAdmin");

router.get("/", checkIfStaffOrAdmin, getAllCoupons);
router.get("/:id", getCoupon);
router.post("/", checkIfStaffOrAdmin, addCoupon);
router.delete("/:id", checkIfStaffOrAdmin, deleteCoupon);

module.exports = router;
