import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiPlusCircle,
  FiTrash2,
  FiEye,
  FiSearch,
  FiUserCheck,
  FiDownload,
  FiLoader,
  FiMail,
  FiPhone,
  FiBook,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { getEvents, getAllUsers, getAdminStats, deleteEvent } from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user, isAdmin, login } = useAuth();

  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'attendees' | 'users'
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected event for viewing registered attendees
  const [selectedEventId, setSelectedEventId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsData, usersData, statsData] = await Promise.all([
        getEvents(),
        getAllUsers().catch(() => []),
        getAdminStats().catch(() => null),
      ]);

      setEvents(eventsData);
      setUsers(usersData);
      setStats(statsData);

      if (eventsData.length > 0 && !selectedEventId) {
        setSelectedEventId(eventsData[0]._id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete event "${title}" from MongoDB?`)) {
      return;
    }
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      if (selectedEventId === id) {
        const remaining = events.filter((e) => e._id !== id);
        if (remaining.length > 0) setSelectedEventId(remaining[0]._id);
      }
      alert("Event deleted successfully!");
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // Quick switch to admin login helper
  const handleQuickAdminLogin = () => {
    login(
      {
        _id: "admin-default",
        name: "Admin Officer",
        email: "admin@eventhub.com",
        role: "admin",
        college: "NSUT Admin Office",
      },
      "demo-admin-token"
    );
  };

  // Filtered lists
  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEvent = events.find((e) => e._id === selectedEventId) || events[0];

  // Export Attendees to CSV
  const handleExportCSV = () => {
    if (!selectedEvent || !selectedEvent.registeredUsers?.length) {
      alert("No attendees to export for this event!");
      return;
    }
    const headers = ["Name,Email,College,Phone,Registered At\n"];
    const rows = selectedEvent.registeredUsers.map(
      (u) =>
        `"${u.name}","${u.email}","${u.college || "N/A"}","${u.phone || "N/A"}","${new Date(u.registeredAt).toLocaleString()}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedEvent.title.replace(/\s+/g, "_")}_Attendees.csv`;
    a.click();
  };

  // If not admin, show login prompt
  if (!isAdmin && (!user || user.role !== "admin")) {
    return (
      <div className="page-wrapper admin-unauthorized">
        <div className="container" style={{ maxWidth: "600px", textAlign: "center" }}>
          <div className="unauth-card glass-card">
            <div className="unauth-icon">🛡️</div>
            <h2 className="unauth-title">Admin Access Required</h2>
            <p className="unauth-desc">
              The Admin Dashboard is restricted to campus organizers and system administrators.
            </p>
            <div className="unauth-actions">
              <Link to="/login" className="btn-primary">
                Log In with Admin Account
              </Link>
              <button onClick={handleQuickAdminLogin} className="btn-secondary">
                ⚡ 1-Click Demo Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate high-level stats if backend adminStats was not loaded
  const totalEventsCount = events.length;
  const totalRegistrationsCount = events.reduce(
    (acc, e) => acc + (e.registeredUsers?.length || e.registered || 0),
    0
  );
  const totalRevenueEst = events.reduce(
    (acc, e) => acc + (e.registeredUsers?.length || e.registered || 0) * (e.price || 0),
    0
  );

  return (
    <div className="page-wrapper admin-page">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-orb" />
        <div className="container admin-header-inner">
          <div className="admin-title-wrap">
            <div className="admin-badge">
              <FiShield /> Admin Control Center
            </div>
            <h1 className="admin-title">Campus Event Management</h1>
            <p className="admin-subtitle">
              Logged in as <strong>{user?.name || "Admin"}</strong> ({user?.email}) · Full Database Privileges
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/create-event" className="btn-primary">
              <FiPlusCircle /> Create New Event
            </Link>
          </div>
        </div>
      </div>

      <div className="container admin-body">
        {/* Metric Cards */}
        <div className="admin-metrics-grid">
          <div className="metric-card glass-card">
            <div className="metric-icon purple"><FiCalendar /></div>
            <div>
              <div className="metric-num">{stats?.totalEvents || totalEventsCount}</div>
              <div className="metric-label">Total Events in DB</div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-icon green"><FiUserCheck /></div>
            <div>
              <div className="metric-num">{stats?.totalRegistrations || totalRegistrationsCount}</div>
              <div className="metric-label">Total Registrations</div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-icon pink"><FiUsers /></div>
            <div>
              <div className="metric-num">{users.length || 5}</div>
              <div className="metric-label">Registered Students</div>
            </div>
          </div>

          <div className="metric-card glass-card">
            <div className="metric-icon orange"><FiDollarSign /></div>
            <div>
              <div className="metric-num">₹{stats?.totalRevenue || totalRevenueEst}</div>
              <div className="metric-label">Total Revenue Generated</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button
            className={`admin-tab-btn ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <FiCalendar /> All Events ({events.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "attendees" ? "active" : ""}`}
            onClick={() => setActiveTab("attendees")}
          >
            <FiUsers /> Registered Attendees Directory
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FiShield /> Platform Users & Students ({users.length})
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="events-loading" style={{ padding: "80px 0" }}>
            <FiLoader className="spin-icon" size={28} />
            <span>Fetching real-time MongoDB data...</span>
          </div>
        )}

        {error && !loading && (
          <div className="events-error">
            <div className="empty-emoji">⚠️</div>
            <h3>Could not load admin data</h3>
            <p>{error}</p>
          </div>
        )}

        {/* TAB 1: ALL EVENTS */}
        {!loading && !error && activeTab === "events" && (
          <div className="admin-section glass-card">
            <div className="admin-table-header">
              <div>
                <h3 className="section-heading">Event Inventory</h3>
                <p className="section-subtext">Manage, inspect, and delete live campus events</p>
              </div>

              <div className="admin-search-box">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Filter events by title/category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Capacity / Fill</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((ev) => {
                    const regCount = ev.registeredUsers?.length || ev.registered || 0;
                    const fillPercent = Math.round((regCount / ev.seats) * 100);
                    return (
                      <tr key={ev._id}>
                        <td>
                          <div className="event-cell-info">
                            <img src={ev.image} alt="" className="table-thumb" />
                            <div>
                              <div className="table-event-title">{ev.title}</div>
                              <div className="table-event-sub">{ev.organizer || "EventHub"} · {ev.location.split(",")[0]}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-purple">{ev.category}</span>
                        </td>
                        <td>
                          <div className="table-date-cell">
                            <span><FiCalendar /> {ev.date}</span>
                            <span className="table-time"><FiClock /> {ev.time}</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-capacity-wrap">
                            <div className="table-capacity-text">
                              <strong>{regCount}</strong> / {ev.seats} ({fillPercent}%)
                            </div>
                            <div className="progress-bar mini">
                              <div
                                className={`progress-fill ${fillPercent >= 90 ? "danger" : fillPercent >= 70 ? "warning" : ""}`}
                                style={{ width: `${Math.min(fillPercent, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          {ev.price === 0 ? (
                            <span className="badge badge-green">Free</span>
                          ) : (
                            <span className="table-price">₹{ev.price}</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-icon-btn view-btn"
                              title="View Attendees"
                              onClick={() => {
                                setSelectedEventId(ev._id);
                                setActiveTab("attendees");
                              }}
                            >
                              <FiUsers />
                            </button>
                            <Link
                              to={`/events/${ev._id}`}
                              className="action-icon-btn link-btn"
                              title="View Public Page"
                            >
                              <FiEye />
                            </Link>
                            <button
                              className="action-icon-btn delete-btn"
                              title="Delete Event"
                              onClick={() => handleDeleteEvent(ev._id, ev.title)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED ATTENDEES DIRECTORY */}
        {!loading && !error && activeTab === "attendees" && (
          <div className="admin-section glass-card">
            <div className="admin-attendees-header">
              <div className="attendee-select-wrap">
                <label className="form-label" htmlFor="event-select">
                  Select Event to View Registered Students:
                </label>
                <select
                  id="event-select"
                  className="form-select"
                  value={selectedEvent?._id || ""}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {events.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.title} ({e.registeredUsers?.length || e.registered || 0} Registered)
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent && (
                <button className="btn-secondary export-btn" onClick={handleExportCSV}>
                  <FiDownload /> Export Attendees (CSV)
                </button>
              )}
            </div>

            {selectedEvent && (
              <div className="selected-event-banner glass-card">
                <img src={selectedEvent.image} alt="" className="banner-thumb" />
                <div className="banner-info">
                  <h3>{selectedEvent.title}</h3>
                  <p>
                    📅 {selectedEvent.date} at {selectedEvent.time} · 📍 {selectedEvent.location} · 🎟️ {selectedEvent.price === 0 ? "Free" : `₹${selectedEvent.price}`}
                  </p>
                </div>
                <div className="banner-stats">
                  <div className="banner-stat-num">{selectedEvent.registeredUsers?.length || selectedEvent.registered || 0}</div>
                  <div className="banner-stat-label">Total Attendees</div>
                </div>
              </div>
            )}

            {selectedEvent?.registeredUsers?.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Email Address</th>
                      <th>College / Department</th>
                      <th>Contact Phone</th>
                      <th>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.registeredUsers.map((attendee, index) => (
                      <tr key={attendee._id || index}>
                        <td><span className="row-index">{index + 1}</span></td>
                        <td>
                          <div className="attendee-name-cell">
                            <div className="student-avatar-circle">
                              {attendee.name?.charAt(0).toUpperCase() || "S"}
                            </div>
                            <strong>{attendee.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="attendee-meta-item"><FiMail /> {attendee.email}</span>
                        </td>
                        <td>
                          <span className="attendee-meta-item"><FiBook /> {attendee.college || "NSUT Student"}</span>
                        </td>
                        <td>
                          <span className="attendee-meta-item"><FiPhone /> {attendee.phone || "—"}</span>
                        </td>
                        <td>
                          <span className="reg-time-tag">
                            <FiCheckCircle />{" "}
                            {attendee.registeredAt
                              ? new Date(attendee.registeredAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recently"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="events-empty" style={{ padding: "50px 0" }}>
                <div className="empty-emoji">👥</div>
                <h3>No Registered Attendees Yet</h3>
                <p>Students who register for this event will automatically show up here in real-time!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PLATFORM USERS & STUDENTS */}
        {!loading && !error && activeTab === "users" && (
          <div className="admin-section glass-card">
            <div className="admin-table-header">
              <div>
                <h3 className="section-heading">All Registered Users</h3>
                <p className="section-subtext">Students and organizers with accounts in MongoDB</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>College / Branch</th>
                    <th>Contact Phone</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="attendee-name-cell">
                          <div className={`student-avatar-circle ${u.role === "admin" ? "admin-avatar" : ""}`}>
                            {u.role === "admin" ? "👑" : u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <strong>{u.name}</strong>
                          </div>
                        </div>
                      </td>
                      <td><FiMail /> {u.email}</td>
                      <td><FiBook /> {u.college || "College Student"}</td>
                      <td><FiPhone /> {u.phone || "—"}</td>
                      <td>
                        <span className={`badge ${u.role === "admin" ? "badge-pink" : "badge-purple"}`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "Recently"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
