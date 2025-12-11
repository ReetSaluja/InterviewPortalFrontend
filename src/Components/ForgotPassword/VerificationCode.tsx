import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./VerificationCode.css";

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "invalid" | "server" };

// ------------------------------
// GENERATE A NEW OTP
// ------------------------------
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ------------------------------
// SEND NEW OTP USING EMAILJS
// ------------------------------
async function sendNewCodeApi(email: string, otp: string): Promise<{ ok: boolean }> {
  try {
    await emailjs.send(
      "service_ccx9ydh",      // Your EmailJS Service ID
      "template_gt6x2rd",     // Your EmailJS Template ID
      {
        email: email,
        passcode: otp,
        time: "15 minutes",
      },
      "hdDUZJi6dh35IzjYR"     // Your EmailJS Public Key
    );

    return { ok: true };
  } catch (err) {
    console.error("EMAILJS RESEND ERROR:", err);
    return { ok: false };
  }
}

// ------------------------------
// VERIFY OTP USING STORED FRONTEND OTP
// ------------------------------
async function verifyCodeApi(
  _email: string,
  frontendOtp: string,
  userEnteredCode: string
): Promise<VerifyResult> {
  if (!frontendOtp) return { ok: false, reason: "expired" };

  if (frontendOtp.trim() !== userEnteredCode.trim())
    return { ok: false, reason: "invalid" };

  return { ok: true };
}

// ------------------------------
// MASK EMAIL
// ------------------------------
function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  const first = email[0];
  const domain = email.slice(at);
  return `${first}${"*".repeat(Math.max(1, at - 1))}${domain}`;
}

const VerificationCode: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Email passed from previous page
  const email =
    (location.state as { email?: string; otp?: string } | undefined)?.email ??
    "*********@mail.com";

  // OTP passed from previous page
  const frontendOtp =
    (location.state as { otp?: string } | undefined)?.otp ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] =
    useState<"idle" | "verifying" | "resending">("idle");
  const [verified, setVerified] = useState(false);

  // Success popup
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const verifying = status === "verifying";
  const resending = status === "resending";
  const hasError = Boolean(error);

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  // ------------------------
  // VERIFY CODE
  // ------------------------
  const handleVerify = async () => {
    setStatus("verifying");
    setError(null);
    setVerified(false);

    const latestOtp = (location.state as { otp?: string })?.otp ?? frontendOtp;
    const res = await verifyCodeApi(email, latestOtp, code.trim());

    if (res.ok) {
      setVerified(true);
    } else {
      const message =
        res.reason === "expired"
          ? "Code expired. Please request a new one."
          : res.reason === "invalid"
          ? "Incorrect code. Try again."
          : "Server error. Try again.";

      setError(message);
      setVerified(false);
    }

    setStatus("idle");
  };

  // ------------------------
  // SEND NEW OTP
  // ------------------------
  const handleSendNewCode = async () => {
    setStatus("resending");
    setError(null);

    const newOtp = generateCode();

    const res = await sendNewCodeApi(email, newOtp);

    if (res.ok) {
      // Update OTP stored in navigation state
      (location.state as any).otp = newOtp;

      setSuccessMessage("A new verification code has been sent to your email.");
      setShowSuccess(true);
    } else {
      setError("Unable to send a new verification code.");
    }

    setStatus("idle");
  };

  const handleContinue = () => {
    navigate("/reset-password", { state: { email } });
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="vc-page">
      <main className="vc-content" role="main" aria-live="polite">
        <h1 className="vc-title">Verify your email</h1>

        <label className="vc-label">Email Address</label>
        <input
          type="text"
          value={maskEmail(email)}
          readOnly
          className="vc-input vc-input-readonly"
        />

        <form
          className="vc-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <label htmlFor="code" className="vc-label vc-label-required">
            Code
          </label>

          <div className={`vc-code-field ${hasError ? "has-error" : verified ? "has-success" : ""}`}>
            <input
              id="code"
              className="vc-code-input"
              placeholder="Enter Code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
                setVerified(false);
              }}
              inputMode="numeric"
              disabled={verifying || resending}
            />
          </div>

          {hasError && <div className="vc-error-text">{error}</div>}

          <div className="vc-button-row-1">
            <button
              type="submit"
              className="vc-btn-black"
              disabled={!code.trim() || verifying}
            >
              {verifying ? "VERIFYING…" : "VERIFY CODE"}
            </button>

            <button
              type="button"
              className="vc-btn-black"
              disabled={resending}
              onClick={handleSendNewCode}
            >
              {resending ? "SENDING…" : "SEND NEW CODE"}
            </button>
          </div>

          <div className="vc-button-row-2">
            <button
              type="button"
              className="vc-btn-gray"
              disabled={!verified}
              onClick={handleContinue}
            >
              CONTINUE
            </button>

            <button
              type="button"
              className="vc-btn-black"
              onClick={handleCancel}
            >
              CANCEL
            </button>
          </div>
        </form>
      </main>

      {/* Success popup */}
      {showSuccess && successMessage && (
        <>
          <div className="vc-overlay"></div>
          <div className="vc-popup vc-popup-success">
            <span>{successMessage}</span>
            <button
              className="vc-popup-close"
              onClick={() => setShowSuccess(false)}
            >
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerificationCode;
