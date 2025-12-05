import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
// NOTE: STATIC_USER_CREDENTIALS is kept for fallback/dev, but not used for API flow.
import { STATIC_USER_CREDENTIALS } from "../data";

export let isLoggedIn: boolean = false;
export const setLoggedIn = (status: boolean) => {
  isLoggedIn = status;
};

type UserRole = "Admin" | "Interviewer";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeRole, setActiveRole] = useState<UserRole>("Admin");
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rememberedEmail");
      if (stored) setEmail(stored);
    } catch {
      /* ignore localStorage errors */
    }
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setError(null);
  };

  /**
   * New handleSubmit: calls backend API POST /auth/login
   * Expects response body to be the user object:
   * { id: number, email: string, role: "admin" | "interviewer" }
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: email.trim(),
        password,
      };

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // If backend later sets httpOnly cookies, add credentials: "include"
      });

      // If server returns non-2xx, try to read message, else fallback
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        const msg =
          errBody?.detail ||
          errBody?.message ||
          errBody?.error ||
          `Login failed (${res.status})`;
        setError(msg);
        setLoading(false);
        return;
      }

      // Server returns user object (no token)
      const user = await res.json().catch(() => null);

      if (!user || !user.email) {
        // fallback: if backend not ready, optionally allow static creds (dev)
        // Remove this fallback in production.
        if (
          email === STATIC_USER_CREDENTIALS.email &&
          password === STATIC_USER_CREDENTIALS.password
        ) {
          // static fallback success (dev)
          setLoggedIn(true);
          if (rememberMe) localStorage.setItem("rememberedEmail", email);
          else localStorage.removeItem("rememberedEmail");
          navigate("/add-interview");
          return;
        }

        setError("Unexpected server response. Please try again.");
        setLoading(false);
        return;
      }

      // Save user in session or local storage depending on rememberMe
      try {
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(user));
        }
      } catch {
        // ignore storage errors
      }

      // Update UI role based on server response (normalize values)
      const serverRole = (user.role || "").toString().toLowerCase();
      if (serverRole === "admin") setActiveRole("Admin");
      else setActiveRole("Interviewer");

      // mark logged-in and navigate
      setLoggedIn(true);
      setLoading(false);
      navigate("/add-interview");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Network error while signing in.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="content-wrapper">
        {/* HEADER */}
        <header className="hero">
          <h1 className="hero-title page-column">Interview Portal</h1>

          <p className="hero-sub page-column">
            Sign in with the personal email address you used during your
            Recruiting Process. Click on "Forgot Password?" to generate a new
            password to access your Dashboard.
          </p>
        </header>

        {/* FORM */}
        <section className="form-area">
          <div className="login-card page-column">
            {/* ROLE TABS */}
            <div className="role-tabs" role="tablist" aria-label="Select role">
              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeRole === "Admin"}
                className={`role-tab ${activeRole === "Admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("Admin")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleRoleChange("Admin");
                }}
              >
                Admin
              </div>

              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeRole === "Interviewer"}
                className={`role-tab ${activeRole === "Interviewer" ? "active" : ""}`}
                onClick={() => handleRoleChange("Interviewer")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleRoleChange("Interviewer");
                }}
              >
                Interviewer
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              {/* EMAIL */}
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="form-group">
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* PASSWORD */}
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="form-group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* FOOTER ROW */}
              <div className="form-footer-row">
                <div className="left-links">
                  <label className="show-password">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show Password
                  </label>

                  <a href="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </a>
                </div>

                <div className="remember">
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />{" "}
                    Remember Me
                  </label>
                </div>
              </div>

              {/* BUTTON */}
              <button type="submit" className="sign-in-button" disabled={loading}>
                {loading ? "Signing in..." : "LOG IN"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
