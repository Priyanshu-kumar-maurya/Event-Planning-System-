import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiCheckCircle,
  FiTag,
  FiUser,
  FiLoader,
  FiLogIn,
  FiLock,
  FiUserPlus,
  FiEdit2,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getEventById, registerForEvent } from "../services/api";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Check if current user is already registered in MongoDB
  const isUserRegistered = () => {
    if (!event || !event.registeredUsers) return false;
    if (user) {
      return event.registeredUsers.some(
        (u) =>
          (u.userId && u.userId.toString() === user._id.toString()) ||
          (u.email && u.email.toLowerCase() === user.email.toLowerCase())
      );
    }
    return false;
  };

  const alreadyRegistered = isUserRegistered();

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (alreadyRegistered || !event) return;

    try {
      setRegisterLoading(true);
      const updated = await registerForEvent(event._id);
      setEvent(updated);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      alert(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ display: "flex", justifyContent: "center", paddingTop: "120px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "var(--text-secondary)" }}>
            <FiLoader size={36} className="spin-icon" style={{ color: "var(--accent-light)" }} />
            <p>Loading event details from MongoDB...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-wrapper not-found">
        <div className="container not-found-inner">
          <div className="not-found-emoji">🎭</div>
          <h2>Event Not Found</h2>
          <p>{error || "The event you're looking for doesn't exist."}</p>
          <Link to="/events" className="btn-primary">
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const regCount = event.registeredUsers?.length || event.registered || 0;
  const spotsLeft = event.seats - regCount;
  const percentFull = Math.round((regCount / event.seats) * 100);
  const isFull = spotsLeft <= 0;

  const canEdit =
    user &&
    (isAdmin ||
      user.role === "admin" ||
      event.createdBy === user._id ||
      (event.creatorEmail && event.creatorEmail.toLowerCase() === user.email?.toLowerCase()) ||
      event.organizer === user.name);

  return (
    <div className="page-wrapper event-detail-page">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        {canEdit && (
          <Link
            to={`/events/${event._id || event.id}/edit`}
            className="btn-secondary"
            style={{
              borderColor: "var(--accent)",
              color: "var(--accent-light)",
              background: "rgba(124, 58, 237, 0.15)",
              gap: "6px",
              padding: "8px 18px",
              fontSize: "0.88rem",
            }}
          >
            <FiEdit2 /> Edit Event (Time, Date, Details)
          </Link>
        )}
      </div>

      {/* Hero Banner */}
      <div className="detail-hero">
        <img src={event.image} alt={event.title} className="detail-hero-img" />
        <div className="detail-hero-overlay" />
        <div className="container detail-hero-content">
          <div className="detail-top-badges">
            <span className="badge badge-purple">{event.category}</span>
            {event.price === 0 ? (
              <span className="badge badge-green">Free Entry</span>
            ) : (
              <span className="badge badge-pink">₹{event.price} Ticket</span>
            )}
            {canEdit && (
              <Link
                to={`/events/${event._id || event.id}/edit`}
                className="badge"
                style={{
                  background: "rgba(124, 58, 237, 0.4)",
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <FiEdit2 size={12} /> Edit Details
              </Link>
            )}
          </div>
          <h1 className="detail-title">{event.title}</h1>
          <p className="detail-organizer">
            <FiUser /> Organized by <strong>{event.organizer}</strong>
          </p>
        </div>
      </div>

      {/* Content Layout */}
      <div className="container detail-layout">
        {/* Left Column */}
        <div className="detail-main">
          {showSuccess && (
            <div className="success-banner animate-fadeIn">
              <FiCheckCircle size={24} />
              <div>
                <strong>Registration Confirmed!</strong>
                <div>You are successfully registered for <strong>{event.title}</strong> 🎉</div>
              </div>
            </div>
          )}

          <div className="detail-section glass-card">
            <h2 className="detail-section-title">About This Event</h2>
            <p className="detail-description">{event.description}</p>
          </div>

          {event.tags?.length > 0 && (
            <div className="detail-section glass-card">
              <h2 className="detail-section-title">
                <FiTag /> Event Tags
              </h2>
              <div className="detail-tags">
                {event.tags.map((tag) => (
                  <span key={tag} className="detail-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Event Schedule & Location */}
          <div className="detail-section glass-card">
            <h2 className="detail-section-title">Event Schedule & Location</h2>
            <div className="detail-meta-grid">
              <div className="detail-meta-item">
                <div className="meta-icon">
                  <FiCalendar />
                </div>
                <div>
                  <div className="meta-label">Date</div>
                  <div className="meta-value">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="detail-meta-item">
                <div className="meta-icon">
                  <FiClock />
                </div>
                <div>
                  <div className="meta-label">Time</div>
                  <div className="meta-value">{event.time}</div>
                </div>
              </div>

              <div className="detail-meta-item">
                <div className="meta-icon">
                  <FiMapPin />
                </div>
                <div>
                  <div className="meta-label">Venue</div>
                  <div className="meta-value">{event.location}</div>
                </div>
              </div>

              <div className="detail-meta-item">
                <div className="meta-icon">
                  <FiUsers />
                </div>
                <div>
                  <div className="meta-label">Capacity</div>
                  <div className="meta-value">
                    {event.seats} seats · {spotsLeft > 0 ? `${spotsLeft} available` : "Full"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Attendees Directory Preview */}
          {event.registeredUsers?.length > 0 && (
            <div className="detail-section glass-card">
              <h2 className="detail-section-title">
                <FiUsers /> Registered Attendees ({event.registeredUsers.length})
              </h2>
              <div className="attendees-avatars-list">
                {event.registeredUsers.slice(0, 8).map((att, i) => (
                  <div key={i} className="attendee-chip" title={`${att.name} (${att.college || ""})`}>
                    <div className="attendee-chip-avatar">
                      {att.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <span className="attendee-chip-name">{att.name}</span>
                  </div>
                ))}
                {event.registeredUsers.length > 8 && (
                  <div className="attendee-more-chip">
                    +{event.registeredUsers.length - 8} more students
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Registration Sidebar */}
        <div className="detail-sidebar">
          <div className="sidebar-card glass-card">
            <div className="sidebar-price">
              {event.price === 0 ? (
                <span className="price-free">Free</span>
              ) : (
                <span className="price-paid">₹{event.price}</span>
              )}
              <span className="price-label">per attendee</span>
            </div>

            <div className="sidebar-progress">
              <div className="sidebar-progress-info">
                <span>
                  <FiUsers /> {regCount} registered
                </span>
                <span>{percentFull}% capacity</span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${percentFull >= 90 ? "danger" : percentFull >= 70 ? "warning" : ""}`}
                  style={{ width: `${Math.min(percentFull, 100)}%` }}
                />
              </div>
              <div className={`spots-badge ${isFull ? "full" : spotsLeft < 50 ? "low" : ""}`}>
                {isFull ? "🔴 Event Completely Full" : `🟢 ${spotsLeft} spots remaining`}
              </div>
            </div>

            {/* Registration Action: Logged In vs Not Logged In */}
            {user ? (
              <button
                id="register-btn"
                className={`register-btn ${alreadyRegistered ? "registered" : ""} ${isFull ? "full" : ""}`}
                onClick={handleRegister}
                disabled={alreadyRegistered || isFull || registerLoading}
              >
                {registerLoading ? (
                  <>
                    <FiLoader className="spin-icon" /> Registering...
                  </>
                ) : alreadyRegistered ? (
                  <>
                    <FiCheckCircle /> You are Registered!
                  </>
                ) : isFull ? (
                  "Event Full"
                ) : (
                  <>
                    <FiCheckCircle /> Confirm Registration as {user.name.split(" ")[0]}
                  </>
                )}
              </button>
            ) : (
              <div className="auth-required-box">
                <div className="lock-icon-wrap">
                  <FiLock />
                </div>
                <h4>Login Required to Participate</h4>
                <p>
                  Aapko event mein participate / register karne ke liye login ya sign up karna zaroori hai.
                </p>
                <div className="auth-required-btns">
                  <Link to="/login" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    <FiLogIn /> Log In to Register
                  </Link>
                  <Link to="/signup" className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                    <FiUserPlus /> Create New Account
                  </Link>
                </div>
              </div>
            )}

            <div className="sidebar-actions">
              <button
                className={`action-btn ${liked ? "liked" : ""}`}
                onClick={() => setLiked(!liked)}
                id="like-btn"
              >
                <FiHeart /> {liked ? "Saved" : "Save Event"}
              </button>
              <button
                className="action-btn"
                id="share-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert("Event link copied to clipboard!");
                }}
              >
                <FiShare2 /> Share
              </button>
            </div>
          </div>

          <div className="sidebar-info glass-card">
            <div className="quick-info-item">
              <FiCalendar />
              <span>
                {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </div>
            <div className="quick-info-item">
              <FiClock />
              <span>{event.time}</span>
            </div>
            <div className="quick-info-item">
              <FiMapPin />
              <span>{event.location.split(",")[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
