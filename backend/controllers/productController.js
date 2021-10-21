const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Get a Single Product
const getProduct = async (req, res) => {
  try {
    const products = await Product.findById(req.params.id).populate("category");
    if (products) {
      res.json(products);
    } else {
      res.json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Add new Product
const addProduct = async (req, res) => {
  const { title, description, price, category } = req.body;
  const image = req.file.path;
  const owner = req.userId;

  try {
    const oldcategory = await Category.findById(category);
    if (!oldcategory) {
      fs.unlink(image, async (err) => {
        if (err) return res.json({ message: "Server Error" });
        return res.json({ message: "Category not found" });
      });
    } else {
      const newProduct = new Product({
        title,
        description,
        price,
        category,
        image,
        owner,
      });
      await newProduct.save();

      res.json(newProduct);
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Couldn't add products",
    });
  }
};

// Edit a product based on id
const editProduct = async (req, res) => {
  const { title, description, price, category } = req.body;
  const productId = req.params.id;

  try {
    const currentProduct = await Product.findById(productId);

    if (!currentProduct)
      return res.status(400).json({ message: "No Product found with this id" });
    else {
      const updatedProduct = await Product.findByIdAndUpdate(productId, {
        title,
        description,
        price,
        category,
      });
      res.json({
        ...updatedProduct.toObject(),
        title,
        description,
        price,
        category,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const changeImage = async (req, res) => {
  const image = req.file.path;
  const productId = req.params.id;

  const currentProduct = await Product.findById(productId);

  if (!currentProduct)
    return res.status(400).json({ message: "No Product found with this id" });
  else {
    fs.unlink(currentProduct.image, async (err) => {
      if (err)
        return res.status(500).json({ message: "Couldn't upload image." });
      else {
        const updatedProduct = await Product.findByIdAndUpdate(productId, {
          image,
        });
        res.json({ ...updatedProduct.toObject(), image });
      }
    });
  }
};

// Delete a product based on id
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const currentProduct = await Product.findById(productId);

    if (!currentProduct)
      return res.status(400).json({ message: "No Product found with this id" });
    else {
      fs.unlink(currentProduct.image, async (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Couldn't delete product image." });
        else {
          await Product.findByIdAndDelete(productId);
          res.json({ message: "Successfully deleted" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  changeImage,
  deleteProduct,
};
