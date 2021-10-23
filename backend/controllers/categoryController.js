const fs = require("fs");
const db = require("../model/db");

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = db.emptyOrRows(
      await db.query(`SELECT * FROM Categories`, [])
    );
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Couldn't Fetch Data from Database",
    });
  }
};

// Add new Category
const addCategory = async (req, res) => {
  const { title } = req.body;
  const image = req.file.path;

  try {
    const newCategory = await db.query(
      `INSERT INTO Categories (title, image) VALUES (?, ?)`,
      [title, image]
    );
    res.json({ id: newCategory.insertId, title, image });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Couldn't add category",
    });
  }
};

const changeImage = async (req, res) => {
  const image = req.file.path;
  const categoryId = req.params.id;

  const currentCategory = db.emptyOrRows(
    await db.query(`SELECT * FROM Categories WHERE id=?`, [categoryId])
  );

  if (currentCategory.length === 0)
    return res.status(400).json({ message: "No Category found with this id" });
  else {
    fs.unlink(currentCategory[0].image, async (err) => {
      if (err)
        return res.status(500).json({ message: "Couldn't upload image." });
      else {
        await db.query("UPDATE Categories SET image=? WHERE id=?", [
          image,
          categoryId,
        ]);
        res.json({ ...currentCategory[0], image });
      }
    });
  }
};

// Edit a category based on id
const editCategory = async (req, res) => {
  const { title } = req.body;
  const categoryId = req.params.id;

  try {
    const currentCategory = db.emptyOrRows(
      await db.query(`SELECT * FROM Categories WHERE id=?`, [categoryId])
    );
    if (currentCategory.length === 0)
      return res.json({ message: "No Category found with this id" });
    else {
      await db.query(`UPDATE Categories SET title=? WHERE id=?`, [
        title,
        categoryId,
      ]);
      res.json({ title });
    }
  } catch (error) {
    res.json({ message: "Server Error" });
  }
};

// Delete a category based on id
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const currentCategory = db.emptyOrRows(
      await db.query(`SELECT * FROM Categories WHERE id=?`, [categoryId])
    );
    if (currentCategory.length === 0)
      return res.json({ message: "No Category found with this id" });
    else {
      fs.unlink(currentCategory[0].image, async (err) => {
        if (err)
          return res.json({ message: "Couldn't delete Category image." });
        else {
          await db.query(`DELETE FROM Categories WHERE id=?`, [categoryId]);
          res.json({ message: "Successfully deleted" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCategories,
  addCategory,
  changeImage,
  editCategory,
  deleteCategory,
};
