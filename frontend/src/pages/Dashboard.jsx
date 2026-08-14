import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiGrid,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUsers,
  FiPlusCircle,
  FiArrowRight,
  FiTrash2,
  FiLoader,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import {
  getUserRegisteredEvents,
  getUserCreatedEvents,
  getEvents,
  deleteEvent,
  unregisterFromEvent,
} from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("registered");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        // Fetch personalized events from backend
        const [regData, createdData] = await Promise.all([
          getUserRegisteredEvents().catch(() => []),
          getUserCreatedEvents().catch(() => []),
        ]);
        setRegisteredEvents(regData);
        setCreatedEvents(createdData);
      } else {
        // Fallback for non-logged-in visitors: preview first few events
        const all = await getEvents();
        setRegisteredEvents(all.slice(0, 2));
        setCreatedEvents(all.slice(2, 4));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDashboardData();
  }, [user]);

  const handleUnregister = async (eventId, title) => {
    if (!window.confirm(`Unregister from "${title}"?`)) return;
    try {
      await unregisterFromEvent(eventId, {
        userId: user?._id,
        email: user?.email,
      });
      setRegisteredEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert("Failed to unregister: " + err.message);
    }
  };

  const handleDeleteCreated = async (eventId, title) => {
    if (!window.confirm(`Permanently delete event "${title}" from database?`)) return;
    try {
      await deleteEvent(eventId);
      setCreatedEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert("Failed to delete event: " + err.message);
    }
  };

  const displayEvents = activeTab === "registered" ? registeredEvents : createdEvents;

  const stats = [
    { icon: <FiCheckCircle />, value: registeredEvents.length, label: "My Registrations" },
    { icon: <FiCalendar />, value: createdEvents.length, label: "Events Organized" },
    {
      icon: <FiUsers />,
      value: createdEvents.reduce((sum, e) => sum + (e.registeredUsers?.length || e.registered || 0), 0),
      label: "Attendees on My Events",
    },
    { icon: <FiGrid />, value: new Set(registeredEvents.map((e) => e.category)).size, label: "Categories" },
  ];

  return (
    <div className="page-wrapper dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-orb" />
        <div className="container dashboard-header-inner">
          <div className="dashboard-user">
            <div className="user-avatar">
              {isAdmin ? "👑" : user?.name?.charAt(0).toUpperCase() || "👤"}
            </div>
            <div>
              <p className="section-label">Student Dashboard</p>
              <h1 className="dashboard-username">
                {user ? user.name : "Welcome, Student"}
              </h1>
              <p className="dashboard-user-meta">
                {user?.college || "College Member"} · {user?.email || "Explore & Register for Events"}
                {isAdmin && <span className="admin-chip" style={{ marginLeft: "8px" }}>Administrator</span>}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {isAdmin && (
              <Link to="/admin" className="btn-secondary" style={{ color: "#f472b6", borderColor: "rgba(236,72,153,0.4)" }}>
                <FiShield /> Open Admin Panel
              </Link>
            )}
            <Link to="/create-event" className="btn-primary">
              <FiPlusCircle /> Create Event
            </Link>
          </div>
        </div>
      </div>

      <div className="container dashboard-body">
        {/* Metric Cards */}
        {!loading && (
          <div className="dashboard-stats">
            {stats.map((s, i) => (
              <div key={i} className="dash-stat glass-card">
                <div className="dash-stat-icon">{s.icon}</div>
                <div className="dash-stat-value">{s.value}</div>
                <div className="dash-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="events-loading">
            <FiLoader className="spin-icon" size={28} />
            <span>Loading your events from MongoDB...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="events-error">
            <div className="empty-emoji">⚠️</div>
            <h3>Could not load user data</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Tabs */}
            <div className="dashboard-tabs">
              <button
                className={`tab-btn ${activeTab === "registered" ? "active" : ""}`}
                onClick={() => setActiveTab("registered")}
                id="tab-registered"
              >
                <FiCheckCircle /> Registered Events ({registeredEvents.length})
              </button>
              <button
                className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
                onClick={() => setActiveTab("created")}
                id="tab-created"
              >
                <FiCalendar /> Organized by Me ({createdEvents.length})
              </button>
            </div>

            {/* List */}
            {displayEvents.length > 0 ? (
              <div className="dashboard-event-list">
                {displayEvents.map((event, i) => {
                  const regCount = event.registeredUsers?.length || event.registered || 0;
                  return (
                    <div
                      key={event._id}
                      className="dash-event-row glass-card"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <img src={event.image} alt={event.title} className="dash-event-img" />

                      <div className="dash-event-info">
                        <div className="dash-event-badges">
                          <span className="badge badge-purple">{event.category}</span>
                          {event.price === 0 ? (
                            <span className="badge badge-green">Free</span>
                          ) : (
                            <span className="badge badge-pink">₹{event.price}</span>
                          )}
                        </div>
                        <h3 className="dash-event-title">{event.title}</h3>

                        <div className="dash-event-meta">
                          <span>
                            <FiCalendar />
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span><FiClock /> {event.time}</span>
                          <span><FiMapPin /> {event.location?.split(",")[0]}</span>
                          <span><FiUsers /> {regCount}/{event.seats} registered</span>
                        </div>
                      </div>

                      <div className="dash-event-actions">
                        <Link to={`/events/${event._id}`} className="btn-secondary dash-view-btn">
                          View Details <FiArrowRight />
                        </Link>
                        {activeTab === "registered" && (
                          <button
                            className="unregister-btn"
                            onClick={() => handleUnregister(event._id, event.title)}
                          >
                            <FiTrash2 /> Unregister
                          </button>
                        )}
                        {activeTab === "created" && (
                          <button
                            className="unregister-btn"
                            onClick={() => handleDeleteCreated(event._id, event.title)}
                          >
                            <FiTrash2 /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="dash-empty">
                <div className="empty-emoji">
                  {activeTab === "registered" ? "📋" : "🎨"}
                </div>
                <h3>
                  {activeTab === "registered"
                    ? "No Registered Events Yet"
                    : "No Events Organized Yet"}
                </h3>
                <p>
                  {activeTab === "registered"
                    ? "Explore the events directory and register to participate in workshops and fests!"
                    : "Create and publish your first campus event to MongoDB!"}
                </p>
                <Link
                  to={activeTab === "registered" ? "/events" : "/create-event"}
                  className="btn-primary"
                >
                  {activeTab === "registered" ? "Explore Events" : "Create Event"}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
