/*
 * Title: Cards and Dice
 * Description: Cards and Dice project
 * Author: Sadman Zarif (ZarifSoftware)
 * Date: 02/09/2021
 *
 */

// External Imports
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

// Internal Imports
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const couponRoutes = require("./routes/couponRoutes");

// Scaffolding
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/public", express.static(path.join(__dirname, "public")));

dotenv.config();

// Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/coupons", couponRoutes);

// Configuring Server and Database
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
