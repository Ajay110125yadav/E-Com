import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user without password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // attach to request
    next(); // move to next controller
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
