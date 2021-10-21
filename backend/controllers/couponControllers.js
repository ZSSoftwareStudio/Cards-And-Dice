const Coupon = require("../model/couponModel");

// Get All Coupon Codes
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.find({ code: req.params.id });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Add new Coupon Code
const addCoupon = async (req, res) => {
  const { code, discount } = req.body;

  try {
    const oldCouponCode = await Coupon.find({ code });
    if (oldCouponCode[0]) {
      return res.json({ message: "Code Already exists" });
    } else {
      const newCoupon = new Coupon({
        code,
        discount,
      });
      await newCoupon.save();

      res.json(newCoupon);
    }
  } catch (err) {
    res.status(401).json({
      message: "Couldn't add Coupon",
    });
  }
};

// Delete a coupon based on id
const deleteCoupon = async (req, res) => {
  const couponId = req.params.id;
  try {
    const currentCoupon = await Coupon.findById(couponId);
    if (!currentCoupon)
      return res.status(400).json({ message: "No Coupon found with this id" });
    else {
      await Coupon.findByIdAndDelete(couponId);
      res.json({ message: "Successfully deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllCoupons,
  getCoupon,
  addCoupon,
  deleteCoupon,
};
