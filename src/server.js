import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import ProductRoutes from './routes/productRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", ProductRoutes);
app.use("/uploads", express.static("uploads"));
// ⚠️ JSON parser but LIMIT add karna zaroori hai
app.use(express.json({ limit: "10mb" }));
// ⚠️ URL encoded bhi add karo
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err))


app.get("/", (req, res) => {
  res.json({ message: "Ecommerce API Working" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))