import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

// AUTH + ADMIN Middleware import
import { authMiddleware  } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create Product (Admin Only)

router.post("/", upload.single("image"), createProduct);

// Get All Products (Search + Filter + Sort + Pagination)
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProduct);

// Update Product (with image upload)
router.put(
  "/:id", 
  upload.single("image"),
   updateProduct
);

// Delete Product
router.delete("/:id", deleteProduct);

export default router;
