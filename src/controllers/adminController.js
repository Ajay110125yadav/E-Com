import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.model.js";

/**
 * 📊 Dashboard Summary
 */
export const getDashaBoardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 📅 Sales Report (Daily / Monthly)
 */
export const getSalesReport = async (req, res) => {
  try {
    const { type } = req.query; // day | month

    let groupBy;

    if (type === "month") {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      };
    } else {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" }
      };
    }

    const sales = await Order.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: "$amount" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json(sales);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔥 Popular Products
 */
export const getPopularProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ]);

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
