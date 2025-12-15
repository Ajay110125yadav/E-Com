import express from 'express';
import {
  getDashaBoardStats,
  getSalesReport,
  getPopularProducts
} from '../controllers/adminController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

// dashboard summary

router.get("/dashboard", authMiddleware, adminMiddleware, getDashaBoardStats);

// sales report

router.get("/sales-report", authMiddleware, adminMiddleware, getSalesReport);

// popular products
router.get("/popular-products", authMiddleware, adminMiddleware, getPopularProducts);

export default router;