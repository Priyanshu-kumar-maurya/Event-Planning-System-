import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiTag,
  FiImage,
  FiDollarSign,
  FiAlignLeft,
  FiCheckCircle,
  FiType,
  FiLoader,
  FiLock,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { categories } from "../data/mockEvents";
import { createEvent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./CreateEvent.css";

const initialForm = {
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  description: "",
  seats: "",
  price: "",
  tags: "",
  image: "",
  organizer: "",
};

export default function CreateEvent() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  // If user is not logged in, require login
  if (!user) {
    return (
      <div className="page-wrapper auth-page">
        <div className="container" style={{ maxWidth: "560px", textAlign: "center" }}>
          <div className="auth-card glass-card">
            <div className="lock-icon-wrap" style={{ margin: "0 auto 12px" }}>
              <FiLock size={28} />
            </div>
            <h2 className="auth-title">Login Required to Create Events</h2>
            <p className="auth-subtitle">
              Campus event organize karne ke liye aapka account hona zaroori hai taaki aapke banaye hue events aapke dashboard se manage ho sakein.
            </p>
            <div className="auth-required-btns" style={{ marginTop: "16px" }}>
              <Link to="/login" className="btn-primary" style={{ justifyContent: "center" }}>
                <FiLogIn /> Log In to Your Account
              </Link>
              <Link to="/signup" className="btn-secondary" style={{ justifyContent: "center" }}>
                <FiUserPlus /> Create New Student Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Event title is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.seats || isNaN(form.seats) || +form.seats < 1) e.seats = "Enter a valid seat count";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      setApiError(null);

      const eventData = {
        ...form,
        organizer: form.organizer || user.name,
        seats: Number(form.seats),
        price: Number(form.price) || 0,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      await createEvent(eventData);
      setSubmitted(true);
      setTimeout(() => navigate("/events"), 3000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-wrapper">
        <div className="container success-page">
          <div className="success-card glass-card">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Event Created!</h2>
            <p className="success-msg">
              <strong>{form.title}</strong> has been saved to MongoDB under organizer{" "}
              <strong>{user.name}</strong>!
            </p>
            <div className="success-spinner" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper create-page">
      <div className="create-header">
        <div className="create-header-orb" />
        <div className="container create-header-inner">
          <p className="section-label">✨ Organizer Studio</p>
          <h1 className="section-title">Create Campus Event</h1>
          <p className="section-subtitle">
            Publishing as <strong>{user.name}</strong> ({user.email}) · Data saves directly to MongoDB
          </p>
        </div>
      </div>

      <div className="container create-layout">
        <form className="create-form" onSubmit={handleSubmit} noValidate>
          {apiError && <div className="api-error-banner">⚠️ {apiError}</div>}

          {/* Basic Info */}
          <div className="form-section glass-card">
            <h3 className="form-section-title">
              <FiType /> Basic Information
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Event Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? "error" : ""}`}
                placeholder="e.g. Annual Tech Fest 2025"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  className={`form-select ${errors.category ? "error" : ""}`}
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="organizer">
                  Club / Organizer Name
                </label>
                <input
                  id="organizer"
                  name="organizer"
                  type="text"
                  className="form-input"
                  placeholder={`Default: ${user.name}`}
                  value={form.organizer}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                <FiAlignLeft /> Description *
              </label>
              <textarea
                id="description"
                name="description"
                className={`form-textarea ${errors.description ? "error" : ""}`}
                placeholder="Describe your event — schedule, activities, prizes, prerequisites..."
                value={form.description}
                onChange={handleChange}
                rows={5}
              />
              {errors.description && <span className="form-error">{errors.description}</span>}
            </div>
          </div>

          {/* Date & Location */}
          <div className="form-section glass-card">
            <h3 className="form-section-title">
              <FiCalendar /> Date, Time & Venue
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Event Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className={`form-input ${errors.date ? "error" : ""}`}
                  value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="time">
                  Event Time *
                </label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  className={`form-input ${errors.time ? "error" : ""}`}
                  value={form.time}
                  onChange={handleChange}
                />
                {errors.time && <span className="form-error">{errors.time}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Location / Venue *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className={`form-input ${errors.location ? "error" : ""}`}
                placeholder="e.g. Main Auditorium, Block A, NSUT Delhi"
                value={form.location}
                onChange={handleChange}
              />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>
          </div>

          {/* Extra Details */}
          <div className="form-section glass-card">
            <h3 className="form-section-title">
              <FiTag /> Capacity & Pricing
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="seats">
                  <FiUsers /> Total Seats *
                </label>
                <input
                  id="seats"
                  name="seats"
                  type="number"
                  min="1"
                  className={`form-input ${errors.seats ? "error" : ""}`}
                  placeholder="e.g. 200"
                  value={form.seats}
                  onChange={handleChange}
                />
                {errors.seats && <span className="form-error">{errors.seats}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">
                  <FiDollarSign /> Ticket Price (₹)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0 for free entry"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tags">
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-input"
                placeholder="e.g. Hackathon, AI, Workshop (comma separated)"
                value={form.tags}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">
                <FiImage /> Image URL (optional)
              </label>
              <input
                id="image"
                name="image"
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={form.image}
                onChange={handleChange}
              />
              {form.image && (
                <div className="image-preview">
                  <img
                    src={form.image}
                    alt="Preview"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary create-submit-btn"
            id="create-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <FiLoader className="spin-icon" /> Saving to MongoDB...
              </>
            ) : (
              <>
                <FiCheckCircle /> Publish Event
              </>
            )}
          </button>
        </form>

        {/* Live Preview */}
        <div className="create-preview">
          <h3 className="preview-label">Live Preview</h3>
          <div className="preview-card glass-card">
            {form.image ? (
              <img
                src={form.image}
                alt=""
                className="preview-img"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div className="preview-img-placeholder">🖼️ Event Image</div>
            )}
            <div className="preview-body">
              <span className="badge badge-purple">{form.category || "Category"}</span>
              <h4 className="preview-title">{form.title || "Your Event Title"}</h4>
              <p className="preview-desc">
                {form.description
                  ? form.description.substring(0, 100) + (form.description.length > 100 ? "..." : "")
                  : "Event description will appear here..."}
              </p>
              <div className="preview-meta">
                {form.date && (
                  <span>
                    <FiCalendar />
                    {new Date(form.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                {form.time && (
                  <span>
                    <FiClock /> {form.time}
                  </span>
                )}
                {form.location && (
                  <span>
                    <FiMapPin /> {form.location.split(",")[0]}
                  </span>
                )}
                {form.seats && (
                  <span>
                    <FiUsers /> {form.seats} seats
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="db-badge">
            <span>💾 Data saves to MongoDB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
