import express from "express";
import {
  addReview,
  deleteReview,
  getProductReviews
} from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// get reviews of product
router.get("/product/:productId", getProductReviews);

// add or update review
router.post("/:productId", authMiddleware, addReview);

// delete review
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
