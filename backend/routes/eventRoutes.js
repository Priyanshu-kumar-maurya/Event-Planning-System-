const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect, optionalAuth, adminOnly } = require("../middleware/auth");

// ─────────────────────────────────────────
// GET /api/events
// Query params: category, search, sort
// ─────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    let filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { organizer: { $regex: search, $options: "i" } },
        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    let sortOption = { date: 1 };
    if (sort === "popular") sortOption = { registered: -1 };
    if (sort === "free") sortOption = { price: 1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const events = await Event.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    console.error("GET /api/events error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/events/my-registered (Protected)
// ─────────────────────────────────────────
router.get("/user/registered", protect, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    const userId = req.user._id;

    const events = await Event.find({
      $or: [
        { "registeredUsers.userId": userId },
        { "registeredUsers.email": userEmail },
      ],
    }).sort({ date: 1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/events/my-created (Protected)
// ─────────────────────────────────────────
router.get("/user/created", protect, async (req, res) => {
  try {
    const events = await Event.find({
      $or: [
        { createdBy: req.user._id },
        { creatorEmail: req.user.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// GET /api/events/:id — single event
// ─────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (err) {
    console.error("GET /api/events/:id error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/events — create event
// ─────────────────────────────────────────
router.post("/", optionalAuth, async (req, res) => {
  try {
    const {
      title, category, date, time, location,
      description, image, organizer, seats, price, tags,
    } = req.body;

    let tagsArray = tags;
    if (typeof tags === "string") {
      tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const event = await Event.create({
      title,
      category,
      date,
      time,
      location,
      description,
      image: image || undefined,
      organizer: organizer || (req.user ? req.user.name : "EventHub Committee"),
      seats: Number(seats),
      price: Number(price) || 0,
      tags: tagsArray || [],
      createdBy: req.user ? req.user._id : null,
      creatorEmail: req.user ? req.user.email : "",
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      data: event,
    });
  } catch (err) {
    console.error("POST /api/events error:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// PUT /api/events/:id — update event (Protected or Admin)
// ─────────────────────────────────────────
router.put("/:id", optionalAuth, async (req, res) => {
  try {
    if (typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event updated successfully!", data: event });
  } catch (err) {
    console.error("PUT /api/events/:id error:", err.message);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE /api/events/:id (Protected)
// ─────────────────────────────────────────
router.delete("/:id", optionalAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully from MongoDB" });
  } catch (err) {
    console.error("DELETE /api/events/:id error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/events/:id/register (STRICTLY PROTECTED - LOGIN REQUIRED)
// ─────────────────────────────────────────
router.post("/:id/register", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.registered >= event.seats) {
      return res.status(400).json({ success: false, message: "This event is completely full!" });
    }

    // User is guaranteed to exist because of 'protect' middleware
    const attendeeName = req.user.name;
    const attendeeEmail = req.user.email.toLowerCase();
    const attendeePhone = req.user.phone || "";
    const attendeeCollege = req.user.college || "College Student";
    const attendeeUserId = req.user._id;

    // Check if user already registered by userId or email
    const alreadyRegistered = event.registeredUsers.some((u) => {
      if (u.userId && u.userId.toString() === attendeeUserId.toString()) {
        return true;
      }
      return u.email && u.email.toLowerCase() === attendeeEmail;
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event!",
      });
    }

    // Add attendee to registeredUsers array
    event.registeredUsers.push({
      userId: attendeeUserId,
      name: attendeeName,
      email: attendeeEmail,
      phone: attendeePhone,
      college: attendeeCollege,
      registeredAt: new Date(),
    });

    // Update count
    event.registered = event.registeredUsers.length;
    await event.save();

    res.json({
      success: true,
      message: `🎉 Success! Registered as ${attendeeName} for "${event.title}"!`,
      data: event,
    });
  } catch (err) {
    console.error("POST /api/events/:id/register error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/events/:id/unregister (STRICTLY PROTECTED - LOGIN REQUIRED)
// ─────────────────────────────────────────
router.post("/:id/unregister", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const attendeeEmail = req.user.email.toLowerCase();
    const attendeeUserId = req.user._id.toString();

    const initialLength = event.registeredUsers.length;

    event.registeredUsers = event.registeredUsers.filter((u) => {
      if (u.userId && u.userId.toString() === attendeeUserId) return false;
      if (u.email && u.email.toLowerCase() === attendeeEmail) return false;
      return true;
    });

    if (event.registeredUsers.length === initialLength) {
      return res.status(400).json({ success: false, message: "User not found in registered list" });
    }

    event.registered = event.registeredUsers.length;
    await event.save();

    res.json({
      success: true,
      message: "Unregistered successfully from event",
      data: event,
    });
  } catch (err) {
    console.error("POST /api/events/:id/unregister error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
