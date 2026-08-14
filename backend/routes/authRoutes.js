const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "eventhub_super_secret_jwt_key_2025",
    { expiresIn: "30d" }
  );
};

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, college, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user (allow setting role if explicitly passed e.g. for testing admin)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      college: college || "College Student",
      phone: phone || "",
      role: role === "admin" ? "admin" : "user",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/me (Protected)
// ─────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/users (Admin Only)
// ─────────────────────────────────────────
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/admin-stats (Admin Only)
// ─────────────────────────────────────────
router.get("/admin-stats", protect, adminOnly, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const allEvents = await Event.find().select("registered seats price category registeredUsers");

    let totalRegistrations = 0;
    let totalRevenue = 0;
    const categoryCount = {};

    allEvents.forEach((ev) => {
      const regCount = ev.registeredUsers ? ev.registeredUsers.length : (ev.registered || 0);
      totalRegistrations += regCount;
      totalRevenue += regCount * (ev.price || 0);
      categoryCount[ev.category] = (categoryCount[ev.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalEvents,
        totalUsers,
        totalRegistrations,
        totalRevenue,
        categoryCount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
