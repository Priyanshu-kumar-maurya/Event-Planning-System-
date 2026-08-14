import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiShield, FiUser, FiLoader, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await loginUser(email, password);
      login(res.user, res.token);

      // Redirect based on role
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers
  const fillAdmin = () => {
    setEmail("admin@eventhub.com");
    setPassword("admin123");
    setError(null);
  };

  const fillStudent = () => {
    setEmail("rahul@nsut.ac.in");
    setPassword("user123");
    setError(null);
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className="container auth-container">
        <div className="auth-card glass-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo-badge">🎉</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Log in to manage and register for campus events</p>
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
              <label className="form-label" htmlFor="login-email">
                <FiMail /> Email Address
              </label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input icon-padded"
                  placeholder="e.g. rahul@nsut.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                <FiLock /> Password
              </label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  id="login-password"
                  type="password"
                  className="form-input icon-padded"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <FiLoader className="spin-icon" /> Logging in...
                </>
              ) : (
                <>
                  <FiLogIn /> Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="demo-logins-box">
            <span className="demo-label">⚡ Quick 1-Click Demo Login:</span>
            <div className="demo-btns">
              <button
                type="button"
                className="demo-btn admin-demo"
                onClick={fillAdmin}
                title="Fill Admin credentials"
              >
                <FiShield /> Admin Login
              </button>
              <button
                type="button"
                className="demo-btn student-demo"
                onClick={fillStudent}
                title="Fill Student credentials"
              >
                <FiUser /> Student Login
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign Up Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
