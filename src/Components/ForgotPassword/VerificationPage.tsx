import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./VerificationPage.css";

// Mask email function
function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  const first = email[0];
  const domain = email.slice(at);
  return `${first}${"*".repeat(Math.max(1, at - 1))}${domain}`;
}

const VerificationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from previous page
  const email = location.state?.email ?? "";
  const maskedEmail = email ? maskEmail(email) : "";
  
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [status, setStatus] = useState("");
  const [otp, setOtp] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verified, setVerified] = useState(false);

  // Generate 6-digit OTP
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP Email
  const sendVerificationCode = async () => {
    // Validate email
    if (!email.trim()) {
      setStatus("Please enter an email address");
      return;
    }

    setLoading(true);
    setStatus("");

    const code = generateCode();
    setOtp(code); // Store the OTP

    const params = {
      email: email.trim(),
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

      setCodeSent(true);
      setStatus("");

    } catch (error) {
      console.error("EMAIL ERROR:", error);
      setStatus("Failed to send verification code. Try again.");
      setCodeSent(false);
    }

    setLoading(false);
  };

  // Send new verification code
  const handleSendNewCode = async () => {
    setResending(true);
    setCodeError("");
    setVerified(false);
    setCode("");

    const newCode = generateCode();
    setOtp(newCode);

    const params = {
      email: email.trim(),
      passcode: newCode,
      time: "15 minutes",
    };

    try {
      await emailjs.send(
        "service_ccx9ydh",
        "template_gt6x2rd",
        params,
        "hdDUZJi6dh35IzjYR"
      );

      setStatus("");
    } catch (error) {
      console.error("EMAIL ERROR:", error);
      setStatus("Failed to send verification code. Try again.");
    }

    setResending(false);
  };

  // Verify the entered code
  const handleVerifyCode = () => {
    setCodeError("");
    
    if (!code.trim()) {
      setCodeError("Please enter the verification code");
      return;
    }

    if (code.trim() !== otp) {
      setCodeError("Incorrect code. Try again.");
      setVerified(false);
      return;
    }

    setVerified(true);
    setCodeError("");
  };

  // Handle Continue button - navigate to reset password page
  const handleContinue = () => {
    if (codeSent && verified && otp && code.trim() === otp) {
      navigate("/reset-password", {
        state: { email: email.trim() },
      });
    } else if (codeSent && otp) {
      // If code is sent but not verified, navigate to code page
      navigate("/code", {
        state: { email: email.trim(), otp: otp },
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="vp-container">
      <h1 className="vp-title">Verify your email</h1>

      <label className="vp-label">Email Address</label>
      <input 
        type="text" 
        value={maskedEmail}
        readOnly
        className="vp-input vp-input-readonly"
        disabled={loading}
      />

      {!codeSent ? (
        <>
          <div className="vp-btn-row">
            <button
              className="vp-btn-black"
              onClick={sendVerificationCode}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "SEND VERIFICATION CODE"}
            </button>
          </div>
          {status && status.includes("Failed") && <p className="vp-status">{status}</p>}
        </>
      ) : (
        <>
          {!verified && (
            <>
              <label className="vp-label vp-label-required">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setCodeError("");
                  setVerified(false);
                }}
                placeholder="Enter Code"
                className={`vp-input ${codeError ? "vp-input-error" : verified ? "vp-input-success" : ""}`}
                disabled={loading || resending}
                inputMode="numeric"
              />
              {codeError && <p className="vp-error-text">{codeError}</p>}

              <div className="vp-btn-row">
                <button
                  className="vp-btn-black"
                  onClick={handleVerifyCode}
                  disabled={loading || resending || !code.trim()}
                >
                  VERIFY CODE
                </button>
                <button
                  className="vp-btn-black"
                  onClick={handleSendNewCode}
                  disabled={loading || resending}
                >
                  {resending ? "SENDING…" : "SEND NEW CODE"}
                </button>
              </div>
            </>
          )}

          <div className="vp-btn-row-2">
            <button 
              className="vp-btn-black" 
              onClick={handleContinue}
              disabled={!verified || loading || resending}
            >
              CONTINUE
            </button>
            <button 
              className="vp-btn-black" 
              onClick={handleCancel}
              disabled={loading || resending}
            >
              CANCEL
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerificationPage;
