export const adminMiddleware = (req, res, next) => {

  if (!req.user) {
    return res.status(500).json({ message: "Auth failed (no user)" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Not admin" });
  }

  next();
};
