import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name required" });
    

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category Created", category });
  } catch (err) {
    console.log("Error in Create Category:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAta: -1 });
    res.json({ total: categories.length, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Category Updated", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};