const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const CouponModel = mongoose.model("Coupon Codes", couponSchema);

module.exports = CouponModel;
