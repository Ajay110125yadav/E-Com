export const adminMiddleware = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });   
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: only admin can access" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};