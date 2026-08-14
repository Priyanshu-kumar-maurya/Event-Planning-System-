import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBook,
  FiPhone,
  FiUserPlus,
  FiShield,
  FiLoader,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import "./Login.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    phone: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        college: formData.college || "College Student",
        phone: formData.phone || "",
        role: formData.role,
      };

      const res = await registerUser(payload);
      login(res.user, res.token);

      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/events");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="container auth-container">
        <div className="auth-card glass-card" style={{ maxWidth: "540px" }}>
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo-badge">✨</div>
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Join EventHub to discover, register, and organize college events</p>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error-banner animate-fadeIn">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">
                <FiUser /> Full Name *
              </label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  className="form-input icon-padded"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                <FiMail /> College / Personal Email *
              </label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  className="form-input icon-padded"
                  placeholder="e.g. rahul@college.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-college">
                  <FiBook /> College / Branch
                </label>
                <div className="input-with-icon">
                  <FiBook className="input-icon" />
                  <input
                    id="signup-college"
                    name="college"
                    type="text"
                    className="form-input icon-padded"
                    placeholder="e.g. NSUT - CSE 3rd Yr"
                    value={formData.college}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-phone">
                  <FiPhone /> Contact Number
                </label>
                <div className="input-with-icon">
                  <FiPhone className="input-icon" />
                  <input
                    id="signup-phone"
                    name="phone"
                    type="tel"
                    className="form-input icon-padded"
                    placeholder="e.g. 9812345678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-role">
                <FiShield /> Account Type / Role
              </label>
              <select
                id="signup-role"
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Student / Attendee</option>
                <option value="admin">Event Organizer / Admin</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">
                  <FiLock /> Password *
                </label>
                <div className="input-with-icon">
                  <FiLock className="input-icon" />
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    className="form-input icon-padded"
                    placeholder="Min. 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm-password">
                  <FiLock /> Confirm Password *
                </label>
                <div className="input-with-icon">
                  <FiLock className="input-icon" />
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    className="form-input icon-padded"
                    placeholder="Re-type password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              id="signup-submit-btn"
            >
              {loading ? (
                <>
                  <FiLoader className="spin-icon" /> Creating Account...
                </>
              ) : (
                <>
                  <FiUserPlus /> Create Account <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Already registered?{" "}
              <Link to="/login" className="auth-link">
                Log In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
