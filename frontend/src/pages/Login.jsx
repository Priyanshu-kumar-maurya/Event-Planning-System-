import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiLoader,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      "To reset your password, please contact the campus event desk or email admin@eventhub.com."
    );
  };

  return (
    <div className="page-wrapper auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="container auth-container">
        <div className="auth-card glass-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-tag-pill">
              <span className="live-pulse-dot" /> CAMPUS ACCESS PORTAL
            </div>

            <div className="auth-logo-badge">
              <div className="auth-badge-glow" />
              <span className="auth-badge-icon">⚡</span>
            </div>

            <h1 className="auth-title">
              Welcome <span className="auth-title-gradient">Back</span>
            </h1>
            <p className="auth-subtitle">
              Sign in to manage your campus events, passes & live tickets
            </p>
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
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="login-password">
                  <FiLock /> Password
                </label>
                <a
                  href="#forgot"
                  onClick={handleForgotPassword}
                  className="forgot-link"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input icon-padded"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="auth-options-row">
              <label className="custom-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="custom-checkbox"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-btn"
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? (
                <>
                  <FiLoader className="spin-icon" /> Authenticating...
                </>
              ) : (
                <>
                  <FiLogIn /> Sign In to Portal <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Security & Verification Strip */}
          <div className="auth-trust-strip">
            <span className="trust-item">
              <FiShield /> 256-Bit SSL Encrypted
            </span>
            <span className="trust-sep">·</span>
            <span className="trust-item">
              <FiCheckCircle /> Verified Campus Access
            </span>
          </div>

          {/* Footer Callout */}
          <div className="auth-footer-box">
            <span>New to Campus Events?</span>
            <Link to="/signup" className="auth-signup-cta">
              Create an Account <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
