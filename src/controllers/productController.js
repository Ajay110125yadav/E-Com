import Product from "../models/Product.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});


// Create Product
export const createProduct = async (req, res) => {
  try {
     console.log("File =>", req.file);
     console.log("Body =>", req.body);
    const { name, price, description, category } = req.body;

    let imageUrl = null;

    if (req.file) {
      const localPath = req.file.path; // local file path

      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(localPath, {
        folder: "ecommerce_products",
        upload_preset: "ecommerce_products" // must be unsigned
      });

      // Delete local file only if it exists
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }

      imageUrl = result.secure_url;
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: imageUrl
    });

    res.status(201).json({ message: "Product Created", product });

  } catch (err) {
    console.error("Error in createProduct:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get All Products (Search + Filter + Sort + Pagination)
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;
    let query = Product.find();

    // SEARCH
    if (search) {
      query = query.find({ name: { $regex: search, $options: "i" } });
    }

    // FILTER BY CATEGORY
    if (category) {
      query = query.find({ category });
    }

    // PRICE FILTER
    if (minPrice || maxPrice) {
      query = query.find({
        price: {
          ...(minPrice && { $gte: minPrice }),
          ...(maxPrice && { $lte: maxPrice })
        }
      });
    }

    // SORT
    if (sort) {
      const [field, order] = sort.split(":");
      if (field) {
        query = query.sort({ [field]: order === "desc" ? -1 : 1 });
      }
    }

    // PAGINATION
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const products = await query;
    res.json({ total: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (req.file) {
    // local file path
    const localPath = req.file.path;

    // upload to Cloudinary
    const result = await cloudinary.v2.uploader.upload(localPath, {
      folder: "ecommerce_products",
      upload_preset: "ecommerce_products"
    });

    // delete local file
    if (fs.existsSync(localPath)) {   
      fs.unlinkSync(localPath);
    }

    updatedData.image = result.secure_url;  // Cloudinary URL assign
  }

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product Updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
