import Product from "../models/Product.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: req.file ? req.file.filename : null,  // <-- add this line
    });

    res.status(201).json({ message: "Product Created", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Products (Search + filter + Sort + Pagination);

// Get All Products (Search + Filter + Sort + Pagination)
export const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    let query = Product.find();

    // SEARCH
    if (search) {
      query = query.find({
        name: { $regex: search, $options: "i" },
      });
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
          ...(maxPrice && { $lte: maxPrice }),
        },
      });
    }

    // SORT  (✔ safe & error-free)
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
      updatedData.image = req.file.filename;  // <-- add this
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product Updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
