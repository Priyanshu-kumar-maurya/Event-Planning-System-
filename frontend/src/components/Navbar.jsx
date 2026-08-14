import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiHome,
  FiGrid,
  FiLayout,
  FiPlusCircle,
  FiMenu,
  FiX,
  FiShield,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <FiHome /> },
    { to: "/events", label: "Events", icon: <FiGrid /> },
    { to: "/dashboard", label: "Dashboard", icon: <FiLayout /> },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">🎉</div>
            <span className="logo-text">
              Event<span>Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  end={link.to === "/"}
                >
                  {link.icon}
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Admin Panel Link for Admin role */}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
                >
                  <FiShield /> Admin Panel
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Controls */}
          <div className="navbar-right">
            <Link to="/create-event" className="navbar-create-btn">
              <FiPlusCircle />
              Create Event
            </Link>

            {user ? (
              <div className="navbar-user-section">
                <div className="user-pill">
                  <div className={`user-avatar-tiny ${isAdmin ? "admin" : ""}`}>
                    {isAdmin ? "👑" : user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="user-name-label">
                    {user.name.split(" ")[0]}
                    {isAdmin && <span className="admin-chip">Admin</span>}
                  </span>
                </div>
                <button onClick={handleLogout} className="logout-btn" title="Log Out">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="navbar-auth-btns">
                <Link to="/login" className="nav-login-btn">
                  <FiLogIn /> Log In
                </Link>
                <Link to="/signup" className="nav-signup-btn">
                  <FiUserPlus /> Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} color="#f8fafc" /> : <FiMenu size={22} color="#f8fafc" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
            end={link.to === "/"}
            onClick={() => setMenuOpen(false)}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            className="mobile-admin-link"
            onClick={() => setMenuOpen(false)}
          >
            <FiShield /> Admin Dashboard
          </NavLink>
        )}

        <Link
          to="/create-event"
          className="btn-primary"
          style={{ marginTop: "6px", justifyContent: "center" }}
          onClick={() => setMenuOpen(false)}
        >
          <FiPlusCircle /> Create Event
        </Link>

        <div className="mobile-auth-divider" />

        {user ? (
          <div className="mobile-user-box">
            <div className="mobile-user-details">
              <strong>{user.name}</strong>
              <span>{user.email} · {user.role?.toUpperCase()}</span>
            </div>
            <button onClick={handleLogout} className="btn-secondary mobile-logout-btn">
              <FiLogOut /> Log Out
            </button>
          </div>
        ) : (
          <div className="mobile-auth-grid">
            <Link to="/login" className="btn-secondary" onClick={() => setMenuOpen(false)}>
              <FiLogIn /> Log In
            </Link>
            <Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)}>
              <FiUserPlus /> Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
