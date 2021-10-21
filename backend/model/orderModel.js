const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  totalPrice: {
    type: Number,
    default: 0,
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  couponcode: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "unpaid",
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

const OrderModel = mongoose.model("Orders", orderSchema);

module.exports = OrderModel;
