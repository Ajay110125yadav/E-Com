import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentId: String,
    paymentStatus: String,
  },
  { timestamps: true }
);

/**
 * ⭐ IMPORTANT FIX LINE
 * prevents OverwriteModelError
 */
const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
