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
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import { categories } from "../data/mockEvents";
import { createEvent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { normalizeImageUrl, handleImageError } from "../utils/imageHelper";
import "./CreateEvent.css";

const imagePresets = [
  { label: "Tech / AI", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
  { label: "Concert / Music", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" },
  { label: "Sports", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
  { label: "Startup / Business", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80" },
  { label: "Art / Design", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
  { label: "Food / Cooking", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" },
];

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

  // Calculate today's date YYYY-MM-DD for min date constraint
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const todayDate = getTodayString();

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
    if (!form.date) {
      e.date = "Event date is required";
    } else if (form.date < todayDate) {
      e.date = "Past dates are not allowed. Please select today or a future date.";
    }
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

      const normalizedImg = form.image.trim()
        ? normalizeImageUrl(form.image.trim(), form.category)
        : undefined;

      const eventData = {
        ...form,
        image: normalizedImg,
        organizer: form.organizer || user.name,
        seats: Number(form.seats),
        price: Number(form.price) || 0,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      await createEvent(eventData);
      setSubmitted(true);
      setTimeout(() => navigate("/events"), 2500);
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
            <h2 className="success-title">Event Created Successfully!</h2>
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

  const previewImage = normalizeImageUrl(form.image, form.category);
  const tagList = form.tags
    ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="page-wrapper create-page">
      {/* ── HEADER ── */}
      <div className="create-header">
        <div className="create-header-orb" />
        <div className="container create-header-inner">
          <div className="create-header-topbar">
            <div>
              <p className="section-label">✨ SHARE WITH CAMPUS</p>
              <h1 className="section-title">Create New Event</h1>
              <p className="section-subtitle">
                Publish a workshop, fest, hackathon, or sports meet. All data updates in real-time.
              </p>
            </div>
            <button
              type="button"
              className="header-back-link"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft /> Back to Events
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {apiError && (
          <div className="auth-error-banner animate-fadeIn" style={{ marginTop: "24px", marginBottom: "8px" }}>
            ⚠️ {apiError}
          </div>
        )}

        <div className="create-layout">
          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="create-form" noValidate>
            {/* Basic Info */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiType /> Basic Information
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Event Title <span className="req">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={`form-input ${errors.title ? "error" : ""}`}
                  placeholder="e.g. InnovateX: Annual Hackathon 2025"
                  value={form.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="category">
                    Category <span className="req">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    className={`form-select ${errors.category ? "error" : ""}`}
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="form-error">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="organizer">
                    Organizer / Club Name
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
                  <FiAlignLeft /> Description & Agenda <span className="req">*</span>
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
            <div className="form-section">
              <h3 className="form-section-title">
                <FiCalendar /> Date, Time & Venue
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    Event Date <span className="req">*</span> (Future dates only)
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className={`form-input ${errors.date ? "error" : ""}`}
                    value={form.date}
                    onChange={handleChange}
                    min={todayDate}
                  />
                  {errors.date && <span className="form-error">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="time">
                    Event Time <span className="req">*</span>
                  </label>
                  <input
                    id="time"
                    name="time"
                    type="text"
                    placeholder="e.g. 10:00 AM - 4:00 PM"
                    className={`form-input ${errors.time ? "error" : ""}`}
                    value={form.time}
                    onChange={handleChange}
                  />
                  {errors.time && <span className="form-error">{errors.time}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Venue / Location <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <FiMapPin className="input-icon" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className={`form-input icon-padded ${errors.location ? "error" : ""}`}
                    placeholder="e.g. Main Auditorium, Block A, Campus"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>
            </div>

            {/* Extra Details */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiUsers /> Capacity & Pricing
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="seats">
                    Total Seats / Max Capacity <span className="req">*</span>
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
                    Ticket Price (₹) — 0 for Free
                  </label>
                  <div className="input-with-icon">
                    <FiDollarSign className="input-icon" />
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      className="form-input icon-padded"
                      placeholder="0 for free entry"
                      value={form.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media & Tags */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiImage /> Cover Image & Tags
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="image">
                  Cover Image URL (Instagram, Drive, Unsplash, or Direct link)
                </label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  className="form-input"
                  placeholder="Paste Instagram post link (e.g. instagram.com/p/...) or image URL"
                  value={form.image}
                  onChange={handleChange}
                />
                <p className="input-tip">
                  📸 Instagram post links (<code>instagram.com/p/...</code>), Google Drive, Unsplash, etc. automatic load honge.
                </p>
              </div>

              {/* Quick Image Presets */}
              <div className="presets-wrap">
                <span className="presets-label">Quick Image Presets:</span>
                <div className="presets-pills">
                  {imagePresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className={`preset-pill ${form.image === p.url ? "active" : ""}`}
                      onClick={() => setForm((prev) => ({ ...prev, image: p.url }))}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "14px" }}>
                <label className="form-label" htmlFor="tags">
                  Tags (comma separated)
                </label>
                <div className="input-with-icon">
                  <FiTag className="input-icon" />
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    className="form-input icon-padded"
                    placeholder="e.g. Hackathon, AI, Workshop, Certificates"
                    value={form.tags}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                <FiArrowLeft /> Cancel
              </button>

              <button
                type="submit"
                className="btn-primary form-submit-btn"
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
            </div>
          </form>

          {/* ── LIVE PREVIEW SIDEBAR ── */}
          <div className="create-preview">
            <div className="preview-header-bar">
              <span className="preview-label-tag">
                <span className="live-pulse-dot" /> Live Card Preview
              </span>
              <span className="preview-live-hint">Updates in real-time</span>
            </div>

            <div className="preview-card">
              <div className="preview-img-wrap">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="preview-img"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, form.category)}
                />
                <div className="preview-img-overlay" />

                <div className="preview-badges-overlay">
                  <span className="badge badge-purple">
                    {form.category || "Category"}
                  </span>
                  {+form.price === 0 || !form.price ? (
                    <span className="badge badge-green">Free</span>
                  ) : (
                    <span className="badge badge-pink">₹{form.price}</span>
                  )}
                </div>
              </div>

              <div className="preview-body">
                <h3 className="preview-title">
                  {form.title || "Your Event Title"}
                </h3>

                <div className="preview-organizer-pill">
                  <FiUser /> Organized by {form.organizer || user?.name || "Campus Organizer"}
                </div>

                <div className="preview-meta-grid">
                  <div className="preview-meta-item">
                    <FiCalendar />
                    <span>
                      {form.date
                        ? new Date(form.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Date"}
                    </span>
                  </div>
                  <div className="preview-meta-item">
                    <FiClock />
                    <span>{form.time || "Timing"}</span>
                  </div>
                  <div className="preview-meta-item">
                    <FiMapPin />
                    <span>{form.location ? form.location.split(",")[0] : "Venue"}</span>
                  </div>
                  <div className="preview-meta-item">
                    <FiUsers />
                    <span>{form.seats || 0} seats</span>
                  </div>
                </div>

                {form.description && (
                  <p className="preview-desc">
                    {form.description}
                  </p>
                )}

                {tagList.length > 0 && (
                  <div className="preview-tags-wrap">
                    {tagList.map((t) => (
                      <span key={t} className="preview-tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="preview-progress-mock">
                  <div className="preview-progress-text">
                    <span>Capacity: {form.seats || 0} Total</span>
                    <span style={{ color: "#4ade80" }}>Open for registrations</span>
                  </div>
                  <div className="progress-bar mini">
                    <div className="progress-fill" style={{ width: "25%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
