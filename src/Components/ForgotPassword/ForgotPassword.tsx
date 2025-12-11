
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmailFormat = () => {
    if (!email.trim()) {
      setError("This is a required field. Please enter your registered email address.");
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Invalid email address. Please enter a different email address.");
      return false;
    }
    return true;
  };

  // Optional: Verify against your backend (same login DB)
  const verifyEmailFromDB = async () => {
    try {
      setLoading(true);

      // If you have a Vite proxy for /auth, prefer fetch('/auth/check-email?email=...')
      const res = await fetch(
        `http://localhost:8000/auth/check-email?email=${encodeURIComponent(email.trim())}`,
        {
          method: "GET",
          headers: { accept: "application/json" },
        }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        setError(
          errBody?.detail ||
          errBody?.message ||
          "Email not found in system."
        );
        return false;
      }

      const data = await res.json().catch(() => null);
      if (!data?.exists) {
        setError("This email does not exist in our database.");
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err?.message || "Network error while checking email.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateEmailFormat()) return;

    // If you want to skip backend check, comment the next two lines:
    const exists = await verifyEmailFromDB();
    if (!exists) return;

    // ✅ Navigate to /verify with the raw email in router state
    navigate("/verify", { state: { email } });
  };

  const handleCancel = () => navigate("/");

  return (
    <div className="page-wrapper">
      <h1 className="portal-title">Reset your profile password</h1>

      <form className="forgot-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email" className="label">Email Address</label>

        <input
          id="email"
          type="email"
          className={`input-box ${error ? "input-error" : ""}`}
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmailFormat}
          required
        />

        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}

        <div className="btn-row">
          <button type="submit" className="btn btn-black" disabled={loading}>
            {loading ? "Checking..." : "SUBMIT"}
          </button>

          <button type="button" className="btn btn-black" onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
