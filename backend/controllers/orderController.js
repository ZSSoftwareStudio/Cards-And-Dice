const Order = require("../model/orderModel");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { createMollieClient } = require("@mollie/api-client");

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Pay the Order Price
const payForOrder = async (req, res, id) => {
  const mollieClient = createMollieClient({
    apiKey: process.env.PAYMENT_API_KEY,
  });

  mollieClient.payments
    .create({
      amount: {
        value: `${req.body.totalPrice.toString()}.00`,
        currency: "EUR",
      },
      description: `Card's and Dice Payment`,
      redirectUrl: `${process.env.FRONTEND_URL}/order-success?orderId=${id}`,
      webhookUrl: `${process.env.BACKEND_URL}/orders/${id}/mark-as-paid`,
    })
    .then((payment) => {
      res.status(200).json({ url: payment.getPaymentUrl() });
    })
    .catch(async (error) => {
      await Order.findByIdAndDelete(id);
      res.status(200).json({ url: `${process.env.FRONTEND_URL}/order-failed` });
      console.log(error);
    });
};

// Mark order as paid
const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const previousOrder = await Order.findById(id);
    if (!previousOrder) {
      return res.json({ message: "No Order found with the specified id!" });
    } else {
      await Order.findByIdAndUpdate(id, {
        status: "incomplete",
      });

      res.json({
        message: `Your Order id is ${id}. You can track this order from order page.`,
      });
    }
  } catch (error) {
    res.status(200).json({
      message:
        "Sorry, Couldn't place the order. Some technical error occurred. Please contact Admin for this problem.",
    });
  }
};

// Create New Order
const createNewOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      totalPrice: req.body.totalPrice,
      products: req.body.products,
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      phone: req.body.phone,
      address: req.body.address,
      country: req.body.country,
      state: req.body.state,
      zipcode: req.body.zipcode,
      couponcode: req.body.couponcode,
    });
    await newOrder.save();
    const id = newOrder.id;
    const user = await User.find({ email: req.body.email.toLowerCase() });
    if (user && user.length > 0) {
      payForOrder(req, res, id);
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        address: req.body.address,
        state: req.body.state,
        country: req.body.country,
        zipcode: req.body.zipcode,
        password: hashedPassword,
      });

      await newUser.save();

      payForOrder(req, res, id);
    }
  } catch (error) {
    res.json({
      message: "Sorry, Couldn't create new order. Some Error Occured",
    });
    console.log(error);
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const currentOrder = await Order.findById(orderId);

    if (!currentOrder)
      return res.status(200).json({ message: "No Order found with this id" });
    else {
      if (currentOrder.status.toLowerCase() === "unpaid") {
        await Order.findByIdAndDelete(orderId);
        res.json({ message: "Successfully deleted" });
      } else {
        res.json({ message: "You can't delete this order" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark Order as completed
const markOrderAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const previousOrder = await Order.findById(id);
    if (!previousOrder) {
      return res.json({ message: "No Order found with the specified id!" });
    } else {
      if (previousOrder.status.toLowerCase() === "complete") {
        await Order.findByIdAndUpdate(id, {
          status: "incomplete",
        });

        res.json({ message: "Successfully Updated" });
      } else {
        await Order.findByIdAndUpdate(id, {
          status: "complete",
        });

        res.json({ message: "Successfully Updated" });
      }
    }
  } catch (error) {
    res.json({
      message: "Sorry, Couldn't mark the order.",
    });
  }
};

module.exports = {
  getAllOrders,
  payForOrder,
  createNewOrder,
  markOrderAsCompleted,
  markOrderAsPaid,
  deleteOrder,
};
