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
  category: { type: String },
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }

}, {timestamps: true });

export default mongoose.model("Product", productSchema);