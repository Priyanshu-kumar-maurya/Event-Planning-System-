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
  FiEdit2,
  FiCreditCard,
  FiPrinter,
  FiDollarSign,
  FiSmartphone,
  FiX,
  FiDownload,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import {
  getUserRegisteredEvents,
  getUserCreatedEvents,
  getEvents,
  deleteEvent,
  unregisterFromEvent,
} from "../services/api";
import { normalizeImageUrl, handleImageError } from "../utils/imageHelper";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("registered");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

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
        setRegisteredEvents(Array.isArray(regData) ? regData : []);
        setCreatedEvents(Array.isArray(createdData) ? createdData : []);
      } else {
        // Fallback for non-logged-in visitors: preview first few events
        const all = await getEvents();
        const safeAll = Array.isArray(all) ? all : [];
        setRegisteredEvents(safeAll.slice(0, 2));
        setCreatedEvents(safeAll.slice(2, 4));
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

  // Extract all payment history records for the current user
  const paymentHistory = registeredEvents.map((ev) => {
    const reg = ev.registeredUsers?.find(
      (u) =>
        (u.userId && user?._id && u.userId.toString() === user._id.toString()) ||
        (u.email && user?.email && u.email.toLowerCase() === user.email.toLowerCase())
    );
    const isPaid = (ev.price || 0) > 0 || (reg?.paymentAmount || 0) > 0;
    return {
      eventId: ev._id || ev.id,
      eventTitle: ev.title,
      category: ev.category,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      amount: reg?.paymentAmount !== undefined ? reg.paymentAmount : (ev.price || 0),
      paymentStatus: reg?.paymentStatus || (isPaid ? "completed" : "free"),
      paymentMethod: reg?.paymentMethod || (isPaid ? "UPI" : "Free Entry"),
      transactionId: reg?.transactionId || (isPaid ? `TXN_${(ev._id || "").slice(-8).toUpperCase()}` : "FREE_ENTRY"),
      paidAt: reg?.paidAt || reg?.registeredAt || ev.createdAt,
    };
  });

  const totalSpent = paymentHistory.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalEarnedOnCreated = createdEvents.reduce((sum, ev) => {
    const paidSum = (ev.registeredUsers || []).reduce((acc, u) => acc + (u.paymentAmount || ev.price || 0), 0);
    return sum + paidSum;
  }, 0);

  const displayEvents = activeTab === "registered" ? registeredEvents : createdEvents;

  const stats = [
    { icon: <FiCheckCircle />, value: registeredEvents.length, label: "My Registrations" },
    { icon: <FiCalendar />, value: createdEvents.length, label: "Events Organized" },
    { icon: <FiDollarSign />, value: `₹${totalSpent}`, label: "Total Spent on Tickets" },
    { icon: <FiDollarSign />, value: `₹${totalEarnedOnCreated}`, label: "Revenue Received" },
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
              <button
                className={`tab-btn ${activeTab === "payments" ? "active" : ""}`}
                onClick={() => setActiveTab("payments")}
                id="tab-payments"
              >
                <FiCreditCard /> Payment History & Receipts ({paymentHistory.length})
              </button>
            </div>

            {/* Tab: Registered Events or Organized Events */}
            {activeTab !== "payments" && (
              displayEvents.length > 0 ? (
                <div className="dashboard-event-list">
                  {displayEvents.map((event, i) => {
                    const regCount = event.registeredUsers?.length || event.registered || 0;
                    const eventRevenue = (event.registeredUsers || []).reduce(
                      (acc, u) => acc + (u.paymentAmount !== undefined ? u.paymentAmount : (event.price || 0)),
                      0
                    );

                    return (
                      <div
                        key={event._id}
                        className="dash-event-row glass-card"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <img
                          src={normalizeImageUrl(event.image, event.category)}
                          alt={event.title}
                          className="dash-event-img"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, event.category)}
                        />

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

                          {activeTab === "created" && (
                            <div className="organizer-finance-pill">
                              <span className="finance-tag revenue">
                                💰 Total Collected: <strong>₹{eventRevenue}</strong>
                              </span>
                              <span className="finance-tag upi">
                                💳 Receiving UPI: <strong>{event.organizerUpiId || "Standard UPI"}</strong>
                              </span>
                              {event.organizerPayeeName && (
                                <span className="finance-tag payee">
                                  👤 Payee: <strong>{event.organizerPayeeName}</strong>
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="dash-event-actions">
                          <Link to={`/events/${event._id || event.id}`} className="btn-secondary dash-view-btn">
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
                            <>
                              <Link
                                to={`/events/${event._id || event.id}/edit`}
                                className="btn-secondary"
                                style={{
                                  borderColor: "var(--accent)",
                                  color: "var(--accent-light)",
                                  padding: "8px 14px",
                                  fontSize: "0.82rem",
                                  gap: "5px",
                                  textDecoration: "none",
                                }}
                              >
                                <FiEdit2 /> Edit
                              </Link>
                              <button
                                className="unregister-btn"
                                onClick={() => handleDeleteCreated(event._id, event.title)}
                              >
                                <FiTrash2 /> Delete
                              </button>
                            </>
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
              )
            )}

            {/* Tab: Payment History & Receipts */}
            {activeTab === "payments" && (
              paymentHistory.length > 0 ? (
                <div className="dashboard-payment-list">
                  {paymentHistory.map((item, index) => (
                    <div
                      key={item.transactionId + index}
                      className="dash-payment-card glass-card"
                    >
                      <div className="payment-card-left">
                        <div className="payment-icon-avatar">
                          <FiCreditCard />
                        </div>
                        <div className="payment-card-details">
                          <div className="dash-event-badges">
                            <span className="badge badge-purple">{item.category}</span>
                            <span className="badge badge-green">✓ {item.paymentStatus.toUpperCase()}</span>
                          </div>
                          <h3 className="payment-card-title">{item.eventTitle}</h3>
                          <div className="payment-meta-row">
                            <span><FiSmartphone /> Method: <strong>{item.paymentMethod}</strong></span>
                            <span>Ref ID: <code className="payment-ref">{item.transactionId}</code></span>
                            <span>
                              <FiCalendar />
                              {item.paidAt
                                ? new Date(item.paidAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Recent"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="payment-card-right">
                        <div className="payment-amount-box">
                          <span className="payment-amount-label">Amount Paid</span>
                          <span className="payment-amount-val">
                            {item.amount > 0 ? `₹${item.amount}` : "Free Pass"}
                          </span>
                        </div>
                        <div className="payment-actions">
                          <button
                            className="receipt-btn"
                            onClick={() => setSelectedReceipt(item)}
                          >
                            <FiPrinter /> E-Receipt
                          </button>
                          <Link
                            to={`/events/${item.eventId}`}
                            className="btn-secondary dash-view-btn"
                          >
                            Event <FiArrowRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dash-empty">
                  <div className="empty-emoji">💳</div>
                  <h3>No Payment History Yet</h3>
                  <p>
                    You have not registered for any paid events or completed any transactions yet.
                  </p>
                  <Link to="/events" className="btn-primary">
                    Explore Events
                  </Link>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* E-Receipt / Ticket Modal */}
      {selectedReceipt && (
        <div className="receipt-modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="receipt-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-modal-header">
              <div className="receipt-brand">
                <span className="receipt-logo">🎓</span>
                <div>
                  <h3 className="receipt-brand-title">Event Planner Campus</h3>
                  <p className="receipt-brand-subtitle">Official Payment E-Receipt & Entry Pass</p>
                </div>
              </div>
              <button
                className="receipt-close-btn"
                onClick={() => setSelectedReceipt(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="receipt-body">
              <div className="receipt-badge-status">
                <span className="status-dot"></span>
                PAYMENT CONFIRMED · VERIFIED TICKET
              </div>

              <div className="receipt-event-box">
                <span className="badge badge-purple">{selectedReceipt.category}</span>
                <h2 className="receipt-event-title">{selectedReceipt.eventTitle}</h2>
                <div className="receipt-event-meta">
                  <span>
                    📅 {new Date(selectedReceipt.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span>⏰ {selectedReceipt.time}</span>
                  <span>📍 {selectedReceipt.location}</span>
                </div>
              </div>

              <div className="receipt-details-grid">
                <div className="receipt-field">
                  <span className="field-label">Attendee Name</span>
                  <span className="field-value">{user?.name || "Student Attendee"}</span>
                </div>
                <div className="receipt-field">
                  <span className="field-label">Attendee Email</span>
                  <span className="field-value">{user?.email || "attendee@college.edu"}</span>
                </div>
                <div className="receipt-field">
                  <span className="field-label">Transaction Reference</span>
                  <span className="field-value"><code className="payment-ref">{selectedReceipt.transactionId}</code></span>
                </div>
                <div className="receipt-field">
                  <span className="field-label">Payment Mode</span>
                  <span className="field-value">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="receipt-field">
                  <span className="field-label">Payment Date</span>
                  <span className="field-value">
                    {selectedReceipt.paidAt
                      ? new Date(selectedReceipt.paidAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recent"}
                  </span>
                </div>
                <div className="receipt-field highlight">
                  <span className="field-label">Amount Paid</span>
                  <span className="field-value total-amount">
                    {selectedReceipt.amount > 0 ? `₹${selectedReceipt.amount}` : "Free Pass"}
                  </span>
                </div>
              </div>

              <div className="receipt-footer-note">
                <p>This is a computer-generated receipt valid for entry at the event venue. Please present this e-receipt or your registered student ID upon check-in.</p>
              </div>
            </div>

            <div className="receipt-actions">
              <button
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={() => window.print()}
              >
                <FiPrinter /> Print Receipt / Save as PDF
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

