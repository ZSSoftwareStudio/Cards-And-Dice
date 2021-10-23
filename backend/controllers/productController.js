const fs = require("fs");
const db = require("../model/db");

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = db.emptyOrRows(
      await db.query(`SELECT * FROM Products`, [])
    );
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
    const products = db.emptyOrRows(
      await db.query(`SELECT * FROM Products WHERE id=?`, [req.params.id])
    );
    if (products.length !== 0) {
      res.json(products[0]);
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
    const oldcategory = db.emptyOrRows(
      await db.query(`SELECT * FROM Categories WHERE id=?`, [category])
    );
    if (oldcategory.length === 0) {
      fs.unlink(image, async (err) => {
        if (err) return res.json({ message: "Server Error" });
        return res.json({ message: "Category not found" });
      });
    } else {
      const newProduct = await db.query(
        `INSERT INTO Products (title, description, image, price, category, owner) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description, image, price, category, owner]
      );

      res.json({
        id: newProduct.insertId,
        title,
        description,
        image,
        price,
        category,
        owner,
        message: "Uploaded Successfully",
      });
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
    const currentProduct = db.emptyOrRows(
      await db.query(`SELECT * FROM Products WHERE id=?`, [productId])
    );

    if (currentProduct.length === 0)
      return res.json({ message: "No Product found with this id" });
    else {
      await db.query(
        "UPDATE Products SET title = ?, description = ?, price = ?, category = ? WHERE id = ?",
        [title, description, price, category, productId]
      );
      res.json({
        ...currentProduct[0],
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

  const currentProduct = db.emptyOrRows(
    await db.query(`SELECT * FROM Products WHERE id=?`, [productId])
  );

  if (currentProduct.length === 0)
    return res.json({ message: "No Product found with this id" });
  else {
    fs.unlink(currentProduct[0].image, async (err) => {
      if (err)
        return res.status(500).json({ message: "Couldn't upload image." });
      else {
        await db.query("UPDATE Products SET image = ? WHERE id = ?", [
          image,
          productId,
        ]);
        res.json({ ...currentProduct[0], image });
      }
    });
  }
};

// Delete a product based on id
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const currentProduct = db.emptyOrRows(
      await db.query(`SELECT * FROM Products WHERE id=?`, [productId])
    );
    if (currentProduct.length === 0)
      return res.json({ message: "No Product found with this id" });
    else {
      fs.unlink(currentProduct[0].image, async (err) => {
        if (err) return res.json({ message: "Couldn't delete product image." });
        else {
          await db.query("DELETE FROM Products WHERE id = ?", [productId]);
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
