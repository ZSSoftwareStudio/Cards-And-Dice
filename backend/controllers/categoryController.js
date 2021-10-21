const fs = require("fs");

const Category = require("../model/categoryModel");
const Product = require("../model/productModel");

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
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
    const newcategory = new Category({
      title,
      image,
    });
    await newcategory.save();

    res.json(newcategory);
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Couldn't add category",
    });
  }
};

// Edit a category based on id
const editCategory = async (req, res) => {
  const { title } = req.body;
  const image = req.file.path;
  const categoryId = req.params.id;

  try {
    const currentCategory = await Category.findById(categoryId);
    console.log(currentCategory);
    if (!currentCategory)
      return res
        .status(400)
        .json({ message: "No Category found with this id" });
    else {
      fs.unlink(currentCategory.image, async (err) => {
        if (err)
          return res.status(500).json({ message: "Couldn't upload image." });
        else {
          const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
            title,
            image,
          });
          res.json(updatedCategory);
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a category based on id
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const currentCategory = await Category.findById(categoryId);
    console.log(currentCategory);
    if (!currentCategory)
      return res
        .status(400)
        .json({ message: "No Category found with this id" });
    else {
      fs.unlink(currentCategory.image, async (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Couldn't delete Category image." });
        else {
          await Category.findByIdAndDelete(categoryId);
          await Product.deleteMany({ category: currentCategory._id });
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
  editCategory,
  deleteCategory,
};
