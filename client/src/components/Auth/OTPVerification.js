import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import "./OTPVerification.css";

const OTPVerification = ({ initialEmail, onBack }) => {
  const { setAuthAfterOTP } = useAuth(); // 👈 yaha se aa jayega
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { login } = useAuth();

  console.log("OTPVerification component rendered with isOtpSent:", isOtpSent);
  console.log("Email:", email);
  console.log("Initial email prop:", initialEmail);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();

    try {
      console.log("=== SENDING OTP ===");
      setError("");
      setSuccessMessage("");
      setLoading(true);

      const response = await authAPI.sendOTP(email);

      console.log("API Response received:", response);

      // Updated condition: Check if OTP was sent successfully
      if (response.status === 200) {
        console.log("OTP sent successfully, setting isOtpSent to true");
        setSuccessMessage("OTP sent successfully! Check your email.");
        setIsOtpSent(true);
      } else {
        console.log("OTP sending failed with response:", response.data);
        setError(response.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
    setLoading(false);
  };
  // const handleVerifyOTP = async () => {
  //   try {
  //     const res = await authAPI.verifyOTP(email, otp);

  //     if (res.data.success) {
  //       const { token, user } = res.data;

  //       // Local storage me save kar
  //       localStorage.setItem("token", token);

  //       // Context login
  //       login({ token, user });

  //       console.log("✅ Logged in:", user);
  //     }
  //   } catch (err) {
  //     console.error("❌ OTP verification failed:", err);
  //   }
  // };

  const handleVerifyOTP = async () => {
    try {
      const res = await authAPI.verifyOTP(email, otp);

      if (res.data.success) {
        const { token, user } = res.data;

        // direct context update (no API call)
        setAuthAfterOTP({ token, user });

        console.log("✅ Logged in:", user);
      }
    } catch (err) {
      console.error("❌ OTP verification failed:", err);
    }
  };

  // If OTP hasn't been sent yet, show email form
  if (!isOtpSent) {
    console.log("Rendering email form");

    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Login with OTP</h2>
          {error && <div className="error">{error}</div>}
          {successMessage && <div className="success">{successMessage}</div>}

          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  console.log("Email input changed:", e.target.value);
                  setEmail(e.target.value);
                }}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="button-group">
              {onBack && (
                <button
                  type="button"
                  onClick={() => {
                    console.log("Back button clicked");
                    onBack();
                  }}
                  className="back-btn"
                >
                  Back to Login
                </button>
              )}
              <button
                disabled={loading || !email}
                type="submit"
                className="primary-btn"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>

          {/* <div className="debug-info">
            <h4>Debug Information</h4>
            <p>Current state: Email input form</p>
            <p>isOtpSent: {isOtpSent.toString()}</p>
            <p>Email: {email}</p>
            <p>Check browser console for detailed API request/response logs.</p>
          </div> */}
        </div>
      </div>
    );
  }

  // If OTP has been sent, show verification form
  console.log("Rendering OTP verification form");
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Enter OTP</h2>
        <p>OTP sent to your email</p>
        <p className="email-display">{email}</p>

        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}

        <form onSubmit={handleVerifyOTP}>
          <div className="form-group">
            <label>OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                console.log("OTP input changed:", e.target.value);
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              }}
              required
              placeholder="Enter the 6-digit code"
              maxLength="6"
              autoFocus
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={() => {
                console.log("Change Email button clicked");
                setIsOtpSent(false);
                setOtp("");
                setError("");
                setSuccessMessage("");
              }}
              className="back-btn"
            >
              Change Email
            </button>
            <button
              disabled={loading || otp.length !== 6}
              type="submit"
              className="primary-btn"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>

        <div className="resend-otp">
          <p>Didn't receive the code?</p>
          <button
            onClick={() => {
              console.log("Resend OTP button clicked");
              handleSendOTP();
            }}
            disabled={loading}
            className="resend-btn"
          >
            Resend OTP
          </button>
        </div>

        {/* <div className="debug-info">
          <h4>Debug Information</h4>
          <p>Current state: OTP verification form</p>
          <p>isOtpSent: {isOtpSent.toString()}</p>
          <p>Email: {email}</p>
          <p>OTP length: {otp.length}</p>
          <p>Check browser console for detailed API request/response logs.</p>
        </div> */}
      </div>
    </div>
  );
};

export default OTPVerification;
