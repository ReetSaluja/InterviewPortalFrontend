import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./VerificationPage.css";

const VerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get BOTH emails from previous page
  const maskedEmail = location.state?.maskedEmail ?? "";
  const realEmail = location.state?.email ?? "";   // <-- REAL EMAIL

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Generate 6-digit OTP
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP Email
  const sendVerificationCode = async () => {
    setLoading(true);
    setStatus("");

    const code = generateCode();

    const params = {
      email: realEmail,   // <-- IMPORTANT: send to REAL email
      passcode: code,
      time: "15 minutes",
    };

    try {
      await emailjs.send(
        "service_ccx9ydh",   // EmailJS service ID
        "template_gt6x2rd",  // EmailJS template ID
        params,
        "hdDUZJi6dh35IzjYR"  // public key
      );

      setStatus("Verification code sent successfully!");

      // Navigate to code page with OTP + real email
      navigate("/code", {
        state: { email: realEmail, otp: code },
      });

    } catch (error) {
      console.error("EMAIL ERROR:", error);
      setStatus("Failed to send verification code. Try again.");
    }

    setLoading(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="vp-container">
      <h1 className="vp-title">Verify your email</h1>

      <label className="vp-label">Email Address</label>
      <input type="text" value={maskedEmail} readOnly className="vp-input" />

      <div className="vp-btn-row">
        <button
          className="vp-btn-black"
          onClick={sendVerificationCode}
          disabled={loading}
        >
          {loading ? "Sending..." : "SEND VERIFICATION CODE"}
        </button>
      </div>

      {status && <p className="vp-status">{status}</p>}
        <div className="vp-btn-row 2">
        <button className="vp-btn-gray" onClick={handleCancel}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;
