import { FiCalendar, FiHeart, FiGithub, FiMail, FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon-sm">🎉</span>
              <span className="footer-logo-text">Event<span>Hub</span></span>
            </Link>
            <p className="footer-tagline">
              Your ultimate college event management platform. Create, discover, and join amazing events.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="GitHub"><FiGithub /></a>
              <a href="#" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Browse Events</Link></li>
              <li><Link to="/create-event">Create Event</Link></li>
              <li><Link to="/dashboard">My Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/events?cat=Technology">Technology</Link></li>
              <li><Link to="/events?cat=Cultural">Cultural</Link></li>
              <li><Link to="/events?cat=Sports">Sports</Link></li>
              <li><Link to="/events?cat=Music">Music</Link></li>
            </ul>
          </div>

          {/* Stats */}
          <div className="footer-col">
            <h4>Platform Stats</h4>
            <div className="footer-stats">
              <div className="footer-stat">
                <span className="stat-num">500+</span>
                <span className="stat-label">Events Created</span>
              </div>
              <div className="footer-stat">
                <span className="stat-num">10K+</span>
                <span className="stat-label">Students Joined</span>
              </div>
              <div className="footer-stat">
                <span className="stat-num">50+</span>
                <span className="stat-label">Colleges</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 EventHub. College Project — Made with <FiHeart className="heart-icon" /> by Team EventHub</p>
          <p>Built with React + MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
