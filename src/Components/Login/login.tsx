/**
 * LOGIN COMPONENT
 * 
 * This component handles user authentication for the Interview Portal.
 * Features:
 * - Role selection (Admin/Interviewer)
 * - Email and password input with validation
 * - Password visibility toggle
 * - API integration with backend authentication
 * - Session storage for user data
 * - Error handling and display
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

// Global login state - tracks if user is authenticated across the app
export let isLoggedIn: boolean = false;
export const setLoggedIn = (status: boolean) => {
  isLoggedIn = status;
};

// Type definition for user roles
type UserRole = "Admin" | "Interviewer";

const Login = () => {
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  // Form state management
  const [email, setEmail] = useState<string>("");              // User's email input
  const [password, setPassword] = useState<string>("");         // User's password input
  const [activeRole, setActiveRole] = useState<UserRole>("Admin"); // Selected role tab
  const [error, setError] = useState<string | null>(null);     // Error message to display

  // UI state management
  const [showPassword, setShowPassword] = useState<boolean>(false); // Toggle password visibility
  const [loading, setLoading] = useState<boolean>(false);            // Loading state during API call
  
  // Email dropdown state management
  const [emails, setEmails] = useState<string[]>([]);         // List of emails fetched from API
  const [loadingEmails, setLoadingEmails] = useState<boolean>(false); // Loading state for fetching emails

  /**
   * Fetches emails from API based on selected role
   * Called when role changes or component mounts
   */
  useEffect(() => {
    const fetchEmails = async () => {
      // Convert role to lowercase for API (admin/interviewer)
      const roleParam = activeRole.toLowerCase();
      setLoadingEmails(true);
      setEmail(""); // Clear selected email when role changes
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:8000/auth/users?role=${roleParam}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          const msg =
            errBody?.detail ||
            errBody?.message ||
            errBody?.error ||
            `Failed to fetch users (${res.status})`;
          setError(msg);
          setEmails([]);
          setLoadingEmails(false);
          return;
        }

        const data = await res.json().catch(() => null);
        
        // Handle different response formats - could be array of emails or array of user objects
        if (Array.isArray(data)) {
          // If array contains objects with email property, extract emails
          const emailList = data.map((item) => 
            typeof item === "string" ? item : item.email || item.Email || ""
          ).filter((email) => email !== "");
          setEmails(emailList);
        } else if (data?.emails && Array.isArray(data.emails)) {
          setEmails(data.emails);
        } else {
          setEmails([]);
        }
      } catch (err: any) {
        console.error("Error fetching emails:", err);
        setError(err?.message || "Network error while fetching emails.");
        setEmails([]);
      } finally {
        setLoadingEmails(false);
      }
    };

    fetchEmails();
  }, [activeRole]);

  /**
   * Handles role tab selection
   * When user clicks Admin or Interviewer tab, updates active role and clears any errors
   */
  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setError(null);
  };

  /**
   * FORM SUBMISSION HANDLER
   * 
   * Process:
   * 1. Validates form inputs (email and password required)
   * 2. Sends POST request to backend API (/auth/login)
   * 3. Handles success: saves user data to sessionStorage and navigates to dashboard
   * 4. Handles errors: displays error message to user
   * 
   * API Response Format:
   * Success: { id: number, email: string, role: "admin" | "interviewer" }
   * Error: { detail/message/error: string }
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null);    // Clear any previous errors

    // Basic client-side validation - check if fields are filled
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true); // Show loading state on button
    try {
      // Prepare payload for API request
      const payload = {
        email: email.trim(), // Remove whitespace from email
        password,
      };

      // Make API call to backend authentication endpoint
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // If backend later sets httpOnly cookies, add credentials: "include"
      });

      // Handle API error responses (non-2xx status codes)
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        // Try to extract error message from various possible response formats
        const msg =
          errBody?.detail ||
          errBody?.message ||
          errBody?.error ||
          `Login failed (${res.status})`;
        setError(msg);
        setLoading(false);
        return;
      }

      // Parse successful response - server returns user object
      const user = await res.json().catch(() => null);

      // Validate that user object is present and has required fields
      if (!user || !user.email) {
        setError("Unexpected server response. Please try again.");
        setLoading(false);
        return;
      }

      // Save user data to sessionStorage (cleared when browser tab closes)
      // This allows other components to access user info
      try {
        sessionStorage.setItem("user", JSON.stringify(user));
        // Dispatch custom event to notify Header component of login
        window.dispatchEvent(new Event("userLoggedIn"));
      } catch {
        // Ignore storage errors (e.g., if storage is disabled)
      }

      // Update UI role based on server response
      // Normalize role values (handle case differences)
      const serverRole = (user.role || "").toString().toLowerCase();
      if (serverRole === "admin") setActiveRole("Admin");
      else setActiveRole("Interviewer");

      // Mark user as logged in and navigate to dashboard
      setLoggedIn(true);
      setLoading(false);
      navigate("/add-interview");
    } catch (err: any) {
      // Handle network errors or unexpected exceptions
      console.error("Login error:", err);
      setError(err?.message || "Network error while signing in.");
      setLoading(false);
    }
  };

  /**
   * COMPONENT RENDER
   * 
   * Structure:
   * - Hero section: Page title
   * - Form section: Login form with role tabs, email/password inputs, and submit button
   * - Role tabs: Allow switching between Admin and Interviewer roles
   * - Form inputs: Email and password with validation
   * - Footer row: Show password checkbox and forgot password link
   * - Submit button: Triggers authentication API call
   */
  return (
    <div className="login-page">
      <div className="content-wrapper">
        {/* HEADER SECTION - Displays page title */}
        <header className="hero">
          <h1 className="hero-title page-column">Interview Portal</h1>
        </header>

        {/* FORM SECTION - Contains login form */}
        <section className="form-area">
          <div className="login-card page-column">
            {/* ROLE SELECTION TABS - Toggle between Admin and Interviewer */}
            <div className="role-tabs" role="tablist" aria-label="Select role">
              {/* Admin Tab - Active when activeRole is "Admin" */}
              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeRole === "Admin"}
                className={`role-tab ${activeRole === "Admin" ? "active" : ""}`}
                onClick={() => handleRoleChange("Admin")}
                onKeyDown={(e) => {
                  // Keyboard accessibility: Enter or Space activates tab
                  if (e.key === "Enter" || e.key === " ") handleRoleChange("Admin");
                }}
              >
                Admin
              </div>

              {/* Interviewer Tab - Active when activeRole is "Interviewer" */}
              <div
                role="tab"
                tabIndex={0}
                aria-selected={activeRole === "Interviewer"}
                className={`role-tab ${activeRole === "Interviewer" ? "active" : ""}`}
                onClick={() => handleRoleChange("Interviewer")}
                onKeyDown={(e) => {
                  // Keyboard accessibility: Enter or Space activates tab
                  if (e.key === "Enter" || e.key === " ") handleRoleChange("Interviewer");
                }}
              >
                Interviewer
              </div>
            </div>

            {/* LOGIN FORM - Handles form submission */}
            <form onSubmit={handleSubmit} noValidate>
              {/* ERROR MESSAGE - Displays validation or API errors */}
              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              {/* EMAIL DROPDOWN FIELD */}
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <div className="form-group">
                <select
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loadingEmails}
                >
                  <option value="">
                    {loadingEmails ? "Loading emails..." : "Email"}
                  </option>
                  {emails.map((emailOption) => (
                    <option key={emailOption} value={emailOption}>
                      {emailOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* PASSWORD INPUT FIELD - Type changes based on showPassword state */}
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="form-group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle between text/password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* FOOTER ROW - Contains password visibility toggle and forgot password link */}
              <div className="form-footer-row">
                <div className="left-links">
                  {/* Show Password Checkbox - Toggles password visibility */}
                  <label className="show-password">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    Show Password
                  </label>

                  {/* Forgot Password Link - Navigates to password reset page */}
                  <a href="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* SUBMIT BUTTON - Disabled during API call, shows loading state */}
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
