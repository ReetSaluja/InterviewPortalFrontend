import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./VerificationPage.css";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from previous page
  const email = (location.state as { email?: string })?.email ?? "";

  // Form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate password fields
  const validatePassword = () => {
    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return false;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        const errorMsg =
          errBody?.detail ||
          errBody?.message ||
          errBody?.error ||
          `Failed to update password (${response.status})`;
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Success - password updated
      setSuccess(true);
      setError("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/", {
          state: {
            message: "Password updated successfully! Please login with your new password.",
          },
        });
      }, 2000);
    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err?.message || "Network error while updating password. Please try again.");
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="vp-container">
      <h1 className="vp-title">Reset Password</h1>

      {success ? (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#2563eb", fontSize: "16px", fontWeight: 600 }}>
            ✓ Password updated successfully! Redirecting to login...
          </p>
        </div>
      ) : (
        <>
          {/* Email field (read-only) */}
          <label className="vp-label">Email Address</label>
          <input
            type="email"
            value={email}
            readOnly
            className="vp-input"
            style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
          />

          <form onSubmit={handleSubmit}>
            {/* New Password field */}
            <label className="vp-label" htmlFor="newPassword">
              New Password <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                className={`vp-input ${error ? "input-error" : ""}`}
                disabled={loading}
                required
              />
            </div>

            {/* Confirm Password field */}
            <label className="vp-label" htmlFor="confirmPassword" style={{ marginTop: "20px" }}>
              Confirm Password <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm new password"
                className={`vp-input ${error ? "input-error" : ""}`}
                disabled={loading}
                required
              />
            </div>

            {/* Show Password checkbox */}
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span style={{ fontSize: "14px" }}>Show Password</span>
              </label>
            </div>

            {/* Error message */}
            {error && (
              <p className="error-text" style={{ marginTop: "8px" }}>
                {error}
              </p>
            )}

            {/* Submit button */}
            <div className="vp-btn-row">
              <button
                type="submit"
                className="vp-btn-black"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </button>
            </div>
          </form>

          {/* Cancel button */}
          <div className="vp-btn-row-2">
            <button
              type="button"
              className="vp-btn-gray"
              onClick={handleCancel}
              disabled={loading}
            >
              CANCEL
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
