const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    user = new User({ name, email, password, role });
    await user.save();

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Firebase Auth Sync / Register / Login
router.post("/firebase-sync", async (req, res) => {
  try {
    const { name, email, firebaseUid, role } = req.body;

    if (!email || !firebaseUid) {
      return res.status(400).json({ error: "Email and Firebase UID are required" });
    }

    // Check if user already exists by firebaseUid
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Check if user exists by email (to link account if they used standard login earlier)
      user = await User.findOne({ email });

      if (user) {
        // Link firebaseUid to existing user account
        user.firebaseUid = firebaseUid;
        if (name && !user.name) user.name = name;
        await user.save();
      } else {
        // Determine role: default is user, unless email is admin@dining.com or explicitly role: admin
        let assignedRole = "user";
        if (email.toLowerCase() === "admin@dining.com" || role === "admin") {
          assignedRole = "admin";
        }

        user = new User({
          name: name || email.split("@")[0],
          email,
          firebaseUid,
          role: assignedRole
        });
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({ message: "Firebase authentication synced successfully", token, user });
  } catch (err) {
    console.error("Firebase Sync Error:", err);
    res.status(500).json({ error: "Server Error during authentication sync" });
  }
});

module.exports = router;
