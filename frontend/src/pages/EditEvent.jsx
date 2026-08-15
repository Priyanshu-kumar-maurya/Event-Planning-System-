import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  FiArrowLeft,
  FiSave,
  FiEye,
} from "react-icons/fi";
import { categories } from "../data/mockEvents";
import { getEventById, updateEvent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./CreateEvent.css";

const imagePresets = [
  { label: "Tech / AI", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" },
  { label: "Concert / Music", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" },
  { label: "Sports", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
  { label: "Startup / Business", url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80" },
  { label: "Art / Design", url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80" },
  { label: "Food / Cooking", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80" },
];

export default function EditEvent() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Fetch initial event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setInitialLoading(true);
        setApiError(null);
        const data = await getEventById(id);
        if (!data) {
          throw new Error("Event not found");
        }

        // Format tags
        const tagsString = Array.isArray(data.tags)
          ? data.tags.join(", ")
          : data.tags || "";

        // Format date to YYYY-MM-DD for input[type="date"]
        let formattedDate = data.date || "";
        if (formattedDate && formattedDate.includes("T")) {
          formattedDate = formattedDate.split("T")[0];
        }

        setForm({
          title: data.title || "",
          category: data.category || "",
          date: formattedDate,
          time: data.time || "",
          location: data.location || "",
          description: data.description || "",
          seats: data.seats ? String(data.seats) : "",
          price: data.price !== undefined ? String(data.price) : "0",
          tags: tagsString,
          image: data.image || "",
          organizer: data.organizer || "",
        });
      } catch (err) {
        setApiError(err.message || "Failed to load event details");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Event title is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.date) e.date = "Date is required";
    if (!form.time.trim()) e.time = "Time is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.seats || isNaN(form.seats) || +form.seats < 1)
      e.seats = "Enter a valid seat count";
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
      setSaving(true);
      setApiError(null);

      const payload = {
        title: form.title.trim(),
        category: form.category,
        date: form.date,
        time: form.time.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        seats: Number(form.seats),
        price: Number(form.price) || 0,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image: form.image.trim() || undefined,
        organizer: form.organizer.trim() || (user ? user.name : "Event Organizer"),
      };

      await updateEvent(id, payload);
      setSavedSuccess(true);
      setTimeout(() => {
        navigate(`/events/${id}`);
      }, 1500);
    } catch (err) {
      setApiError(err.message || "Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="page-wrapper create-page">
        <div className="container" style={{ textAlign: "center", padding: "100px 0" }}>
          <FiLoader className="spin-icon" size={36} style={{ color: "var(--accent-light)", marginBottom: "16px" }} />
          <p style={{ color: "var(--text-secondary)" }}>Loading event for editing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper create-page">
      {/* Header */}
      <div className="create-header">
        <div className="create-header-orb" />
        <div className="container create-header-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p className="section-label">✏️ Update Event</p>
              <h1 className="section-title">Edit Event Details</h1>
              <p className="section-subtitle">
                Change event date, timing, location, description, or capacity. All updates sync to MongoDB.
              </p>
            </div>
            <Link to={`/events/${id}`} className="btn-secondary" style={{ gap: "6px" }}>
              <FiEye /> View Event Page
            </Link>
          </div>
        </div>
      </div>

      <div className="container create-body">
        {/* Success Modal / Banner */}
        {savedSuccess && (
          <div className="success-banner animate-fadeIn" style={{ marginBottom: "24px" }}>
            <FiCheckCircle size={28} />
            <div>
              <strong>Event Updated Successfully! 🎉</strong>
              <div>Redirecting to the event page...</div>
            </div>
          </div>
        )}

        {/* Error */}
        {apiError && (
          <div className="auth-error-banner animate-fadeIn" style={{ marginBottom: "20px" }}>
            ⚠️ {apiError}
          </div>
        )}

        <div className="create-layout">
          {/* ── FORM ── */}
          <form className="create-form glass-card" onSubmit={handleSubmit} noValidate>
            {/* Section 1: Basic Info */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiType /> Basic Information
              </h3>

              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Event Title <span className="req">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Annual Tech Symposium 2025"
                  value={form.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? "error" : ""}`}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="category">
                  Category <span className="req">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`form-select ${errors.category ? "error" : ""}`}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              {/* Organizer */}
              <div className="form-group">
                <label className="form-label" htmlFor="organizer">
                  Organizer / Society Name
                </label>
                <input
                  id="organizer"
                  type="text"
                  name="organizer"
                  placeholder="e.g. IEEE Student Branch"
                  value={form.organizer}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Section 2: Date, Time & Venue */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiCalendar /> Date, Time & Location
              </h3>

              <div className="form-row">
                {/* Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    Event Date <span className="req">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={`form-input ${errors.date ? "error" : ""}`}
                  />
                  {errors.date && <span className="form-error">{errors.date}</span>}
                </div>

                {/* Time */}
                <div className="form-group">
                  <label className="form-label" htmlFor="time">
                    Event Time <span className="req">*</span>
                  </label>
                  <input
                    id="time"
                    type="text"
                    name="time"
                    placeholder="e.g. 10:00 AM - 4:00 PM"
                    value={form.time}
                    onChange={handleChange}
                    className={`form-input ${errors.time ? "error" : ""}`}
                  />
                  {errors.time && <span className="form-error">{errors.time}</span>}
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Venue / Location <span className="req">*</span>
                </label>
                <div className="input-with-icon">
                  <FiMapPin className="input-icon" />
                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="e.g. Main Auditorium, Block A, Campus"
                    value={form.location}
                    onChange={handleChange}
                    className={`form-input icon-padded ${errors.location ? "error" : ""}`}
                  />
                </div>
                {errors.location && <span className="form-error">{errors.location}</span>}
              </div>
            </div>

            {/* Section 3: Description */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiAlignLeft /> Description & Details
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Full Description <span className="req">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="Describe the event, agenda, rules, guest speakers, eligibility..."
                  value={form.description}
                  onChange={handleChange}
                  className={`form-textarea ${errors.description ? "error" : ""}`}
                />
                {errors.description && (
                  <span className="form-error">{errors.description}</span>
                )}
              </div>
            </div>

            {/* Section 4: Capacity & Pricing */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiUsers /> Capacity & Entry Fee
              </h3>

              <div className="form-row">
                {/* Seats */}
                <div className="form-group">
                  <label className="form-label" htmlFor="seats">
                    Total Seats / Max Capacity <span className="req">*</span>
                  </label>
                  <input
                    id="seats"
                    type="number"
                    name="seats"
                    min="1"
                    placeholder="e.g. 200"
                    value={form.seats}
                    onChange={handleChange}
                    className={`form-input ${errors.seats ? "error" : ""}`}
                  />
                  {errors.seats && <span className="form-error">{errors.seats}</span>}
                </div>

                {/* Price */}
                <div className="form-group">
                  <label className="form-label" htmlFor="price">
                    Entry Fee (₹) — 0 for Free
                  </label>
                  <div className="input-with-icon">
                    <FiDollarSign className="input-icon" />
                    <input
                      id="price"
                      type="number"
                      name="price"
                      min="0"
                      placeholder="0"
                      value={form.price}
                      onChange={handleChange}
                      className="form-input icon-padded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Media & Tags */}
            <div className="form-section">
              <h3 className="form-section-title">
                <FiImage /> Cover Image & Tags
              </h3>

              {/* Image URL */}
              <div className="form-group">
                <label className="form-label" htmlFor="image">
                  Cover Image URL
                </label>
                <input
                  id="image"
                  type="url"
                  name="image"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={handleChange}
                  className="form-input"
                />
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

              {/* Tags */}
              <div className="form-group" style={{ marginTop: "16px" }}>
                <label className="form-label" htmlFor="tags">
                  Tags (comma separated)
                </label>
                <div className="input-with-icon">
                  <FiTag className="input-icon" />
                  <input
                    id="tags"
                    type="text"
                    name="tags"
                    placeholder="e.g. AI, Workshop, Coding, Certificates"
                    value={form.tags}
                    onChange={handleChange}
                    className="form-input icon-padded"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
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
                disabled={saving}
                id="update-event-btn"
              >
                {saving ? (
                  <>
                    <FiLoader className="spin-icon" /> Saving Changes to MongoDB...
                  </>
                ) : (
                  <>
                    <FiSave /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ── LIVE PREVIEW CARD ── */}
          <div className="create-preview-wrap">
            <h4 className="preview-label">Live Preview</h4>
            <div className="preview-card glass-card">
              <div className="preview-img-wrap">
                <img
                  src={
                    form.image ||
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
                  }
                  alt="Preview"
                  className="preview-img"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";
                  }}
                />
                <div className="preview-badges">
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

              <div className="preview-content">
                <h3 className="preview-title">
                  {form.title || "Your Event Title Here"}
                </h3>
                <p className="preview-organizer">
                  By {form.organizer || user?.name || "Campus Organizer"}
                </p>

                <div className="preview-meta">
                  <span>
                    <FiCalendar /> {form.date || "Date"}
                  </span>
                  <span>
                    <FiClock /> {form.time || "Time"}
                  </span>
                  <span>
                    <FiMapPin /> {form.location || "Venue"}
                  </span>
                  <span>
                    <FiUsers /> {form.seats || 0} seats
                  </span>
                </div>

                {form.description && (
                  <p className="preview-desc">
                    {form.description.slice(0, 100)}
                    {form.description.length > 100 ? "..." : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
