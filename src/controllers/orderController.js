import Order from "../models/order.model.js";
import { fakePaymentGateway } from "../utils/payment.js";

// 1️⃣ Create Checkout
export const createCheckout = async (req, res) => {
  try {
    const { amount, products } = req.body;
    if (!amount || !products) {
      return res.status(400).json({ message: "Amount & products required" });
    }

    // Fake payment
    const payment = await fakePaymentGateway(amount);

    const order = await Order.create({
      userId: req.user.id,
      products,
      amount,
      status: payment.success ? "paid" : "failed",
      paymentStatus: payment.status,
      paymentId: payment.paymentId,
    });

    res.json({
      message: "Order created (fake payment)",
      order,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// 2️⃣ Get My Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
