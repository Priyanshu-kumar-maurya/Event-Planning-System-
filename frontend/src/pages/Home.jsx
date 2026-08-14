import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowRight, FiCalendar, FiUsers, FiStar, FiZap, FiSearch, FiLoader } from "react-icons/fi";
import EventCard from "../components/EventCard";
import { getEvents } from "../services/api";
import "./Home.css";

const stats = [
  { icon: <FiCalendar />, value: "500+", label: "Events Hosted" },
  { icon: <FiUsers />,    value: "10K+", label: "Students Joined" },
  { icon: <FiStar />,     value: "4.9",  label: "Avg. Rating" },
  { icon: <FiZap />,      value: "50+",  label: "Colleges" },
];

const features = [
  { emoji: "🎨", title: "Create Events",       desc: "Organize workshops, fests, seminars, sports — anything! Our smart form saves directly to MongoDB." },
  { emoji: "🔍", title: "Discover & Register", desc: "Browse events filtered by category, date, or location. Register with one click — data updates live." },
  { emoji: "📊", title: "Track Everything",    desc: "Your personal dashboard shows all events you've created and registered for, all in one place." },
  { emoji: "🔔", title: "Stay Updated",        desc: "Get notified about upcoming events, last-minute changes, and exciting new opportunities." },
];

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents({ sort: "popular" })
      .then((data) => {
        setFeaturedEvents(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch(() => setFeaturedEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper home-page">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="container hero-content">
          <div className="hero-badge">
            <FiZap /> College Event Management Platform · MongoDB Powered
          </div>

          <h1 className="hero-title">
            Discover & Create<br />
            <span className="gradient-text">Amazing Events</span>
          </h1>

          <p className="hero-subtitle">
            The ultimate platform for college students to find exciting events, connect with peers, and create unforgettable experiences — all saved to MongoDB in real-time.
          </p>

          <div className="hero-actions">
            <Link to="/events" className="btn-primary hero-btn-main">
              Explore Events <FiArrowRight />
            </Link>
            <Link to="/create-event" className="btn-secondary">
              Create an Event
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hero-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search events, categories, organizers..."
              className="hero-search-input"
              onFocus={(e) => e.target.closest('.hero-search').classList.add('focused')}
              onBlur={(e) => e.target.closest('.hero-search').classList.remove('focused')}
            />
            <Link to="/events" className="search-btn">Search</Link>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="hero-float-cards">
          <div className="float-card animate-float" style={{ animationDelay: "0s" }}>
            <span className="float-card-emoji">🎉</span>
            <div>
              <div className="float-card-title">Tech Fest 2025</div>
              <div className="float-card-sub">Saved to MongoDB ✓</div>
            </div>
          </div>
          <div className="float-card animate-float" style={{ animationDelay: "1s" }}>
            <span className="float-card-emoji">🎵</span>
            <div>
              <div className="float-card-title">Music Festival</div>
              <div className="float-card-sub">723 registered</div>
            </div>
          </div>
          <div className="float-card animate-float" style={{ animationDelay: "0.5s" }}>
            <span className="float-card-emoji">⚽</span>
            <div>
              <div className="float-card-title">Sports Meet</div>
              <div className="float-card-sub">Live from DB</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-card glass-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">🔥 From MongoDB</p>
              <h2 className="section-title">Featured Events</h2>
              <p className="section-subtitle">
                Live data from your MongoDB database — events update in real-time.
              </p>
            </div>
            <Link to="/events" className="btn-secondary see-all-btn">
              See All Events <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="events-loading">
              <FiLoader className="spin-icon" />
              <span>Loading from MongoDB...</span>
            </div>
          ) : Array.isArray(featuredEvents) && featuredEvents.length > 0 ? (
            <div className="events-grid">
              {featuredEvents.map((event, i) => (
                <EventCard key={event._id || event.id || i} event={event} delay={i * 100} />
              ))}
            </div>
          ) : (
            <div className="events-empty" style={{ padding: "40px 0" }}>
              <div className="empty-emoji">📭</div>
              <h3>No events in database yet</h3>
              <p>Run the seed script or create your first event!</p>
              <Link to="/create-event" className="btn-primary">Create First Event</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="features-orb" />
        <div className="container">
          <div className="features-header">
            <p className="section-label">Why EventHub?</p>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              From discovering to creating — manage your entire college event life in one platform.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="feature-emoji">{f.emoji}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card">
            <div className="cta-orb" />
            <div className="cta-content">
              <h2 className="cta-title">Ready to Create Your Event?</h2>
              <p className="cta-subtitle">
                Join thousands of students already using EventHub. Your event data is saved directly to MongoDB — free forever.
              </p>
              <div className="cta-actions">
                <Link to="/create-event" className="btn-primary"><FiZap /> Get Started Free</Link>
                <Link to="/events" className="btn-secondary">Browse Events</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
