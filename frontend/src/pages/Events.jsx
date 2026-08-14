import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiSliders, FiLoader } from "react-icons/fi";
import EventCard from "../components/EventCard";
import CategoryFilter from "../components/CategoryFilter";
import { getEvents } from "../services/api";
import { categories } from "../data/mockEvents";
import "./Events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Fetch from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents({
          category: activeCategory,
          search: searchQuery,
          sort: sortBy,
        });
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search query
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="page-wrapper events-page">
      {/* Header */}
      <div className="events-header">
        <div className="events-header-orb" />
        <div className="container events-header-inner">
          <p className="section-label">🎯 Browse All</p>
          <h1 className="section-title">Upcoming Events</h1>
          <p className="section-subtitle">
            Explore events across categories. Find your next great experience.
          </p>
        </div>
      </div>

      <div className="container events-body">
        {/* Controls */}
        <div className="events-controls">
          <div className="events-search-wrap">
            <FiSearch className="events-search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="events-search-input"
              id="events-search"
            />
          </div>

          <div className="events-sort-wrap">
            <FiSliders />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select events-sort-select"
              id="events-sort"
            >
              <option value="date">Sort: Date</option>
              <option value="popular">Sort: Popular</option>
              <option value="free">Sort: Free First</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="events-filter-bar">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
          />
          {!loading && (
            <span className="events-count">{events.length} events</span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="events-loading">
            <FiLoader className="spin-icon" />
            <span>Loading events...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="events-error">
            <div className="empty-emoji">⚠️</div>
            <h3>Could not load events</h3>
            <p>{error}</p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Make sure the backend is running: <code>node server.js</code>
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="events-grid-full">
            {events.map((event, i) => (
              <EventCard key={event._id} event={event} delay={i * 80} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="events-empty">
            <div className="empty-emoji">🔍</div>
            <h3>No events found</h3>
            <p>Try adjusting your search or filter.</p>
            <button
              className="btn-primary"
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
