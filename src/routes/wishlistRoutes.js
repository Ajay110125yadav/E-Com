import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);

export default router;