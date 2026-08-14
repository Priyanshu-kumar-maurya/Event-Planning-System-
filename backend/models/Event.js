const mongoose = require("mongoose");

const registeredUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: [true, "Attendee name is required"],
    },
    email: {
      type: String,
      required: [true, "Attendee email is required"],
    },
    phone: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      default: "",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technology", "Cultural", "Sports", "Business", "Art", "Music", "Food", "Other"],
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    },
    organizer: {
      type: String,
      default: "EventHub Committee",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    creatorEmail: {
      type: String,
      default: "",
    },
    seats: {
      type: Number,
      required: [true, "Total seats required"],
      min: [1, "Seats must be at least 1"],
    },
    registered: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Detailed list of all registered users
    registeredUsers: {
      type: [registeredUserSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: spots left
eventSchema.virtual("spotsLeft").get(function () {
  return this.seats - this.registered;
});

// Virtual: percent full
eventSchema.virtual("percentFull").get(function () {
  return Math.round((this.registered / this.seats) * 100);
});

// Ensure virtuals appear in JSON output
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
