const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  image: {
    type: String,
    default: "public/users/default-avatar.png",
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "User",
  },
  status: {
    type: String,
    default: "active",
  },
  provider: {
    type: String,
    default: "Email",
  },
  orders: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Orders",
      },
    ],
    default: [],
  },
});

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
