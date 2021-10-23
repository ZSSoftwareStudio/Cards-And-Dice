const bcrypt = require("bcrypt");
const { createMollieClient } = require("@mollie/api-client");
const db = require("../model/db");

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = db.emptyOrRows(await db.query(`SELECT * FROM Orders`, []));
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
      await db.query("DELETE FROM Orders WHERE id=?", [id]);
      res.status(200).json({ url: `${process.env.FRONTEND_URL}/order-failed` });
      console.log(error);
    });
};

// Mark order as paid
const markOrderAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const previousOrder = db.emptyOrRows(
      await db.query(`SELECT * FROM Orders WHERE id=?`, [id])
    );
    if (previousOrder.length === 0) {
      return res.json({ message: "No Order found with the specified id!" });
    } else {
      await db.query("UPDATE Orders SET status='incomplete' WHERE id=?", [id]);

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
  const {
    totalPrice,
    products,
    name,
    email,
    phone,
    address,
    country,
    state,
    zipcode,
    couponcode,
  } = req.body;

  try {
    const newOrder = await db.query(
      `INSERT INTO Orders (totalPrice, products, name, email, phone, address, country, state, zipcode, couponcode ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); `,
      [
        totalPrice,
        JSON.stringify(products),
        name,
        email,
        phone,
        address,
        country,
        state,
        zipcode,
        couponcode,
      ]
    );
    const id = newOrder.insertId;
    const user = db.emptyOrRows(
      await db.query(`SELECT * FROM Users WHERE email=?`, [email.toLowerCase()])
    );
    if (user && user.length > 0) {
      payForOrder(req, res, id);
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await db.query(
        `INSERT INTO Users (name, email, phone, address, state, country, zipcode, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?); `,
        [name, email, phone, address, state, country, zipcode, hashedPassword]
      );
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
    const currentOrder = db.emptyOrRows(
      await db.query(`SELECT * FROM Orders WHERE id=?`, [orderId])
    );
    if (currentOrder.length === 0) {
      return res.status(200).json({ message: "No Order found with this id" });
    } else {
      if (currentOrder[0].status.toLowerCase() === "unpaid") {
        await db.query("DELETE FROM Orders WHERE id=?", [orderId]);
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
    const previousOrder = db.emptyOrRows(
      await db.query(`SELECT * FROM Orders WHERE id=?`, [id])
    );
    if (previousOrder.length === 0) {
      return res.json({ message: "No Order found with the specified id!" });
    } else {
      if (previousOrder[0].status.toLowerCase() === "complete") {
        await db.query("UPDATE Orders SET status='incomplete' WHERE id=?", [
          id,
        ]);

        res.json({ message: "Successfully Updated" });
      } else {
        await db.query("UPDATE Orders SET status='complete' WHERE id=?", [id]);

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
