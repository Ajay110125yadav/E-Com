import express from "express";
import {  addToCart, removeFromCart, getUserCart,  updateQuantity } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getUserCart);
router.put("/update", authMiddleware, updateQuantity);
router.delete("/remove/:id", authMiddleware, removeFromCart);

export default router;
