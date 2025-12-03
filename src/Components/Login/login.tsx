import React, { useState, useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { STATIC_USER_CREDENTIALS } from "../data";

export let isLoggedIn: boolean = false;
export const setLoggedIn = (status: boolean) => {
  isLoggedIn = status;
};

type UserRole = "Admin" | "Interviewer";

/**
 * Modern-typed functional component (no React.FC).
 * Returns JSX.Element explicitly for clarity.
 */
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeRole, setActiveRole] = useState<UserRole>("Admin");
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      email === STATIC_USER_CREDENTIALS.email &&
      password === STATIC_USER_CREDENTIALS.password
    ) {
      setLoggedIn(true);

      try {
        if (rememberMe) localStorage.setItem("rememberedEmail", email);
        else localStorage.removeItem("rememberedEmail");
      } catch {
        /* ignore localStorage errors */
      }

      navigate("/add-interview");
    } else {
      setError("Invalid email or password. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="content-wrapper">

        {/* HEADER */}
        <header className="hero">
          <h1 className="hero-title page-column">
            Onboarding Dashboard
          </h1>

          <p className="hero-sub page-column">
            Sign in with the personal email address you used during your
            Recruiting Process. Click on "Forgot Password?" to generate a
            new password to access your Dashboard.
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
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleRoleChange("Admin"); }}
              >
                Admin
              </div>

              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeRole === "Interviewer"}
                className={`role-tab ${activeRole === "Interviewer" ? "active" : ""}`}
                onClick={() => handleRoleChange("Interviewer")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleRoleChange("Interviewer"); }}
              >
                Interviewer
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="error-message" role="alert">{error}</div>}

              {/* EMAIL */}
              <label className="field-label" htmlFor="email">Email Address</label>
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
              <label className="field-label" htmlFor="password">Password</label>
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

                  <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
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
              <button type="submit" className="sign-in-button">LOG IN</button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
