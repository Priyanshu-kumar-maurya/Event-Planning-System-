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
  FiEdit2,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiLayers,
  FiPercent,
  FiAward,
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
              <Link to="/login" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Log In with Admin Account
              </Link>
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

  // Helper for category chart colors
  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case "technology":
      case "tech":
        return "#8b5cf6"; // Purple
      case "cultural":
        return "#ec4899"; // Pink
      case "sports":
        return "#10b981"; // Emerald
      case "business":
        return "#f59e0b"; // Amber
      case "art":
        return "#06b6d4"; // Cyan
      case "music":
        return "#f43f5e"; // Rose
      case "food":
        return "#fb923c"; // Orange
      case "academic":
        return "#3b82f6"; // Blue
      default:
        return "#6366f1"; // Indigo
    }
  };

  // ── Analytics Computation ──────────────────────────
  const categoryStats = events.reduce((acc, ev) => {
    const cat = ev.category || "General";
    const regs = ev.registeredUsers?.length || ev.registered || 0;
    const rev = regs * (ev.price || 0);
    if (!acc[cat]) {
      acc[cat] = { count: 0, registrations: 0, revenue: 0, capacity: 0 };
    }
    acc[cat].count += 1;
    acc[cat].registrations += regs;
    acc[cat].revenue += rev;
    acc[cat].capacity += ev.seats || 0;
    return acc;
  }, {});

  const categoryList = Object.keys(categoryStats)
    .map((cat) => ({
      category: cat,
      ...categoryStats[cat],
    }))
    .sort((a, b) => b.registrations - a.registrations);

  const totalSeatsAllEvents = events.reduce((acc, e) => acc + (e.seats || 0), 0);
  const overallOccupancy =
    totalSeatsAllEvents > 0
      ? Math.round((totalRegistrationsCount / totalSeatsAllEvents) * 100)
      : 0;

  const freeEventsCount = events.filter((e) => !e.price || e.price === 0).length;
  const paidEventsCount = events.filter((e) => e.price > 0).length;

  const topEventsByReg = [...events]
    .map((e) => {
      const reg = e.registeredUsers?.length || e.registered || 0;
      const seats = e.seats || 1;
      const pct = Math.min(100, Math.round((reg / seats) * 100));
      return {
        id: e._id,
        title: e.title,
        category: e.category,
        registered: reg,
        seats: e.seats || 0,
        price: e.price || 0,
        revenue: reg * (e.price || 0),
        pct,
      };
    })
    .sort((a, b) => b.registered - a.registered);

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
            className={`admin-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <FiBarChart2 /> Analytics & Graphs 📊
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
                            <Link
                              to={`/events/${ev._id || ev.id}/edit`}
                              className="action-icon-btn edit-btn"
                              title="Edit Event (Time, Date, Details)"
                            >
                              <FiEdit2 />
                            </Link>
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
                              to={`/events/${ev._id || ev.id}`}
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

        {/* ── Analytics & Visual Graphs Tab ────────────────── */}
        {activeTab === "analytics" && (
          <div className="admin-analytics-view animate-fadeIn">
            {/* Top Insight Cards */}
            <div className="analytics-summary-grid">
              <div className="summary-pill-card glass-card">
                <div className="summary-pill-icon purple"><FiPercent /></div>
                <div>
                  <div className="summary-pill-title">Seat Occupancy Rate</div>
                  <div className="summary-pill-val">{overallOccupancy}%</div>
                  <div className="summary-pill-sub">{totalRegistrationsCount} of {totalSeatsAllEvents} total seats booked</div>
                </div>
              </div>

              <div className="summary-pill-card glass-card">
                <div className="summary-pill-icon pink"><FiAward /></div>
                <div>
                  <div className="summary-pill-title">Top Registered Event</div>
                  <div className="summary-pill-val truncate-title">
                    {topEventsByReg[0]?.title || "N/A"}
                  </div>
                  <div className="summary-pill-sub">
                    {topEventsByReg[0]?.registered || 0} attendees ({topEventsByReg[0]?.pct || 0}% filled)
                  </div>
                </div>
              </div>

              <div className="summary-pill-card glass-card">
                <div className="summary-pill-icon green"><FiLayers /></div>
                <div>
                  <div className="summary-pill-title">Most Popular Category</div>
                  <div className="summary-pill-val">
                    {categoryList[0]?.category || "General"}
                  </div>
                  <div className="summary-pill-sub">
                    {categoryList[0]?.registrations || 0} registrations across {categoryList[0]?.count || 0} events
                  </div>
                </div>
              </div>

              <div className="summary-pill-card glass-card">
                <div className="summary-pill-icon orange"><FiDollarSign /></div>
                <div>
                  <div className="summary-pill-title">Ticketing Model</div>
                  <div className="summary-pill-val">₹{stats?.totalRevenue || totalRevenueEst}</div>
                  <div className="summary-pill-sub">
                    {paidEventsCount} Paid ({Math.round((paidEventsCount / (events.length || 1)) * 100)}%) · {freeEventsCount} Free
                  </div>
                </div>
              </div>
            </div>

            {/* Main Graphs Grid: 2 Columns */}
            <div className="analytics-charts-grid">
              {/* Chart 1: Event Registrations vs Seat Capacity Bar Chart */}
              <div className="analytics-chart-card glass-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title"><FiBarChart2 /> Event Registrations vs Seat Capacity</h3>
                    <p className="chart-subtitle">Comparing student registrations with total hall capacity</p>
                  </div>
                  <div className="chart-legend-mini">
                    <span className="legend-indicator reg-indicator">● Registered</span>
                    <span className="legend-indicator cap-indicator">○ Max Capacity</span>
                  </div>
                </div>

                <div className="bar-chart-list">
                  {topEventsByReg.slice(0, 6).map((ev) => {
                    const maxCap = Math.max(...topEventsByReg.map((e) => e.seats || 1), 100);
                    const regWidth = Math.min(100, Math.max(6, (ev.registered / maxCap) * 100));
                    const capWidth = Math.min(100, Math.max(10, (ev.seats / maxCap) * 100));
                    const barColor = getCategoryColor(ev.category);

                    return (
                      <div key={ev.id} className="bar-chart-row">
                        <div className="bar-row-info">
                          <span className="bar-event-title" title={ev.title}>{ev.title}</span>
                          <span className="bar-event-meta">
                            <span className="cat-dot" style={{ backgroundColor: barColor }} />
                            {ev.category} · <strong>{ev.registered}</strong> / {ev.seats} seats
                          </span>
                        </div>

                        <div className="bar-dual-track">
                          {/* Capacity track */}
                          <div
                            className="bar-track-capacity"
                            style={{ width: `${capWidth}%` }}
                            title={`Max Capacity: ${ev.seats} seats`}
                          />
                          {/* Filled bar */}
                          <div
                            className="bar-fill-registered"
                            style={{
                              width: `${regWidth}%`,
                              background: `linear-gradient(90deg, ${barColor} 0%, #a855f7 100%)`,
                            }}
                            title={`${ev.registered} registered (${ev.pct}% full)`}
                          >
                            <span className="bar-fill-label">{ev.registered}</span>
                          </div>
                        </div>

                        <div className="bar-pct-badge-wrap">
                          <span
                            className="bar-pct-badge"
                            style={{
                              color: ev.pct >= 80 ? "#ec4899" : ev.pct >= 40 ? "#38bdf8" : "#94a3b8",
                              borderColor: ev.pct >= 80 ? "rgba(236, 72, 153, 0.4)" : "rgba(56, 189, 248, 0.3)",
                            }}
                          >
                            {ev.pct}% Full
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: Category Distribution Donut Chart */}
              <div className="analytics-chart-card glass-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title"><FiPieChart /> Category Distribution</h3>
                    <p className="chart-subtitle">Event share & total registrations grouped by category</p>
                  </div>
                  <span className="chart-badge">{categoryList.length} Categories</span>
                </div>

                <div className="donut-chart-flex">
                  {/* SVG Donut Visual */}
                  <div className="donut-svg-wrapper">
                    <svg viewBox="0 0 200 200" className="donut-svg">
                      {/* Background circle track */}
                      <circle
                        cx="100"
                        cy="100"
                        r="70"
                        className="donut-bg-track"
                      />
                      {/* Slices */}
                      {(() => {
                        const C = 2 * Math.PI * 70; // ~439.82
                        const totalCount = events.length || 1;
                        let accumulatedOffset = 0;

                        return categoryList.map((catItem) => {
                          const sliceFraction = catItem.count / totalCount;
                          const strokeLength = sliceFraction * C;
                          const strokeOffset = -accumulatedOffset;
                          accumulatedOffset += strokeLength;
                          const color = getCategoryColor(catItem.category);

                          return (
                            <circle
                              key={catItem.category}
                              cx="100"
                              cy="100"
                              r="70"
                              fill="none"
                              stroke={color}
                              strokeWidth="24"
                              strokeDasharray={`${strokeLength} ${C - strokeLength}`}
                              strokeDashoffset={strokeOffset}
                              className="donut-slice"
                              transform="rotate(-90 100 100)"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="donut-center-content">
                      <span className="donut-center-num">{events.length}</span>
                      <span className="donut-center-label">Events</span>
                    </div>
                  </div>

                  {/* Category Legend & Breakdown List */}
                  <div className="category-legend-list">
                    {categoryList.map((c) => {
                      const color = getCategoryColor(c.category);
                      const sharePct = Math.round((c.count / (events.length || 1)) * 100);
                      return (
                        <div key={c.category} className="cat-legend-row">
                          <div className="cat-legend-left">
                            <span className="cat-legend-chip" style={{ backgroundColor: color }} />
                            <div>
                              <div className="cat-legend-name">{c.category}</div>
                              <div className="cat-legend-detail">{c.registrations} students registered</div>
                            </div>
                          </div>
                          <div className="cat-legend-right">
                            <span className="cat-legend-count">{c.count} {c.count === 1 ? "event" : "events"}</span>
                            <span className="cat-legend-pct">{sharePct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart 3: Revenue Breakdown by Category */}
              <div className="analytics-chart-card glass-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title"><FiTrendingUp /> Estimated Revenue by Category</h3>
                    <p className="chart-subtitle">Collection from registrations & ticket prices (₹)</p>
                  </div>
                  <span className="chart-badge">₹{totalRevenueEst.toLocaleString("en-IN")} Total</span>
                </div>

                <div className="revenue-bars-container">
                  {categoryList.map((c) => {
                    const maxRevenue = Math.max(...categoryList.map((i) => i.revenue || 0), 1000);
                    const revPct = Math.min(100, Math.max(c.revenue > 0 ? 10 : 3, Math.round((c.revenue / maxRevenue) * 100)));
                    const color = getCategoryColor(c.category);

                    return (
                      <div key={c.category} className="revenue-item">
                        <div className="revenue-item-header">
                          <div className="rev-cat-title-wrap">
                            <span className="cat-dot" style={{ backgroundColor: color }} />
                            <span className="rev-cat-name">{c.category}</span>
                          </div>
                          <span className="rev-cat-amount">₹{c.revenue.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="rev-bar-track">
                          <div
                            className="rev-bar-fill"
                            style={{
                              width: `${revPct}%`,
                              background: `linear-gradient(90deg, ${color} 0%, #10b981 100%)`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 4: Free vs Paid & Booking Dynamics */}
              <div className="analytics-chart-card glass-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title"><FiCheckCircle /> Pricing & Registration Dynamics</h3>
                    <p className="chart-subtitle">Analysis of Free vs Paid registration appeal and booking yields</p>
                  </div>
                  <span className="chart-badge">Ticketing Insights</span>
                </div>

                <div className="pricing-dynamics-wrap">
                  {/* Split Bar */}
                  <div className="split-progress-wrap">
                    <div className="split-labels">
                      <span className="split-label free-text">
                        🎁 Free Events ({freeEventsCount} - {Math.round((freeEventsCount / (events.length || 1)) * 100)}%)
                      </span>
                      <span className="split-label paid-text">
                        🎟️ Paid Events ({paidEventsCount} - {Math.round((paidEventsCount / (events.length || 1)) * 100)}%)
                      </span>
                    </div>
                    <div className="split-bar-track">
                      <div
                        className="split-bar-free"
                        style={{ width: `${(freeEventsCount / (events.length || 1)) * 100}%` }}
                        title={`Free: ${freeEventsCount} events`}
                      />
                      <div
                        className="split-bar-paid"
                        style={{ width: `${(paidEventsCount / (events.length || 1)) * 100}%` }}
                        title={`Paid: ${paidEventsCount} events`}
                      />
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="pricing-insights-boxes">
                    <div className="pricing-box">
                      <span className="pricing-box-val">
                        {events.filter((e) => (e.registeredUsers?.length || e.registered || 0) > 0).length}
                      </span>
                      <span className="pricing-box-label">Events with Active Bookings</span>
                    </div>
                    <div className="pricing-box">
                      <span className="pricing-box-val">
                        {events.length > 0 ? Math.round(totalRegistrationsCount / events.length) : 0}
                      </span>
                      <span className="pricing-box-label">Avg Registrations / Event</span>
                    </div>
                    <div className="pricing-box">
                      <span className="pricing-box-val">
                        ₹{paidEventsCount > 0 ? Math.round(totalRevenueEst / (paidEventsCount || 1)) : 0}
                      </span>
                      <span className="pricing-box-label">Avg Yield per Paid Event</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
