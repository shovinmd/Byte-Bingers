const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ error: "Access Denied" });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Admin Dashboard Route
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});
router.delete("/delete-review/:id", async (req, res) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) return res.status(404).json({ message: "Review not found" });
      res.json({ message: "Review removed successfully!" });
    } catch (error) {
      console.error("Delete Review Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;
