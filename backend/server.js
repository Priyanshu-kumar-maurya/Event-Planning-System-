const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎉 EventHub API with Auth & Admin is running!",
    version: "2.0.0",
    endpoints: {
      auth: {
        register: "POST   /api/auth/register",
        login: "POST   /api/auth/login",
        me: "GET    /api/auth/me",
        users: "GET    /api/auth/users (Admin)",
        adminStats: "GET    /api/auth/admin-stats (Admin)",
      },
      events: {
        getAllEvents: "GET    /api/events",
        getEvent: "GET    /api/events/:id",
        createEvent: "POST   /api/events",
        updateEvent: "PUT    /api/events/:id",
        deleteEvent: "DELETE /api/events/:id",
        registerEvent: "POST   /api/events/:id/register",
        unregisterEvent: "POST   /api/events/:id/unregister",
        userRegistered: "GET    /api/events/user/registered",
        userCreated: "GET    /api/events/user/created",
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Connect to MongoDB & Start Server ───────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB:", process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Event API: http://localhost:${PORT}/api/events`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
