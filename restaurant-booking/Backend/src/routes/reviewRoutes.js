const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Get reviews for a restaurant
router.get("/:restaurantId", async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate("userID", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a review
router.post("/", async (req, res) => {
  try {
    const { restaurant, userID, rating, comment } = req.body;
    const newReview = new Review({ restaurant, userID, rating, comment });
    await newReview.save();
    res.json(newReview);
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
