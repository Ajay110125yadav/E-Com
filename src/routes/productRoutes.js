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


router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
router.get("/:id", getProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);





export default router;
