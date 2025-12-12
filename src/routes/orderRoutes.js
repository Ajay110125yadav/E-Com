import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createCheckout, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/checkout", authMiddleware, createCheckout);
router.get("/", authMiddleware, getMyOrders);

export default router;
