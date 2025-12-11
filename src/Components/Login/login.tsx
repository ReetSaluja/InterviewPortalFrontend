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
  
  // Field-level error states
  const [emailError, setEmailError] = useState<string>("");    // Email field error
  const [passwordError, setPasswordError] = useState<string>(""); // Password field error

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
      setEmailError(""); // Clear email error when role changes
      setPasswordError(""); // Clear password error when role changes

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
          setEmailError(msg);
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
        setEmailError(err?.message || "Network error while fetching emails.");
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
    setEmailError("");
    setPasswordError("");
  };
  
  /**
   * Handles email field changes
   * Clears email error when user starts typing
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(""); // Clear error when user changes email
  };
  
  /**
   * Handles password field changes
   * Clears password error when user starts typing
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear error when user changes password
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
    setEmailError(""); // Clear email error
    setPasswordError(""); // Clear password error

    // Field-level validation
    let hasErrors = false;
    
    // Email validation
    if (!email.trim()) {
      setEmailError("Please Enter Email Address");
      hasErrors = true;
    } else {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError("Please Enter a Valid Email Address");
        hasErrors = true;
      }
    }
    
    // Password validation
    if (!password) {
      setPasswordError("Please Enter Password");
      hasErrors = true;
    }
    
    if (hasErrors) {
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
        // Show error on both email and password fields for login failures
        setEmailError(msg);
        setPasswordError(msg);
        setLoading(false);
        return; // IMPORTANT: Don't navigate on error
      }

      // Parse successful response - server returns user object
      const user = await res.json().catch(() => null);

      // Validate that user object is present and has required fields
      if (!user || !user.email) {
        setEmailError("Unexpected server response. Please try again.");
        setPasswordError("Unexpected server response. Please try again.");
        setLoading(false);
        return; // IMPORTANT: Don't navigate on error
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

      // Mark user as logged in BEFORE navigation
      setLoggedIn(true);
      setLoading(false);
      
      // Only navigate if login was successful
      // Clear any errors before navigation
      setEmailError("");
      setPasswordError("");
      navigate("/dashboard");
    } catch (err: any) {
      // Handle network errors or unexpected exceptions
      console.error("Login error:", err);
      const errorMsg = err?.message || "Network error while signing in. Please try again.";
      setEmailError(errorMsg);
      setPasswordError(errorMsg);
      setLoading(false);
      // IMPORTANT: Don't navigate on error - stay on login page
      return;
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
              {/* EMAIL INPUT FIELD */}
              <label className="field-label" htmlFor="email">
                Email Address <span className="required-star">*</span>
              </label>
              <div className="form-group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                  className={emailError ? "error-input" : ""}
                />
              </div>
              {emailError && (
                <p className="login-error-text">{emailError}</p>
              )}

              {/* PASSWORD INPUT FIELD - Type changes based on showPassword state */}
              <label className="field-label" htmlFor="password">
                Password <span className="required-star">*</span>
              </label>
              <div className="form-group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle between text/password
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  className={passwordError ? "error-input" : ""}
                />
              </div>
              {passwordError && (
                <p className="login-error-text">{passwordError}</p>
              )}

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

                  {/* Forgot Password Link - Navigates to password reset page*/} 
                  
                 <button type="button" className="forgot-link" onClick={() => navigate("/forgot-password")}>
                  Forgot Password?
                  </button>
                  

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
