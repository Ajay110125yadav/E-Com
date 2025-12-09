import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
  },
  inStack: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: null
  },
  category: { type: String }

}, {timestamps: true });

export default mongoose.model("Product", productSchema);