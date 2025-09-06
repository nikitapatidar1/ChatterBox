

















import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleAuth from './GoogleAuth';
import OTPVerification from './OTPVerification';
import './Auth.css';

// Debug Console Component
const DebugConsole = ({ logs }) => {
  return (
    <div style={{
      background: "#111",
      color: "#0f0",
      fontSize: "12px",
      padding: "5px",
      marginTop: "15px",
      maxHeight: "150px",
      overflowY: "auto",
      borderRadius: "8px"
    }}>
      <strong>📟 Debug Console</strong>
      {logs.length === 0 ? (
        <div style={{ color: "#888" }}>No logs yet...</div>
      ) : (
        logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))
      )}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [logs, setLogs] = useState([]);   // store logs here
  
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  // Custom log function (replace console.log)
  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
    console.log(msg); // normal console bhi
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/chat');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      addLog("🔄 Attempting login...");

      const result = await login(email, password);
      addLog("✅ Login response: " + JSON.stringify(result));

      if (result.success) {
        navigate('/chat');
      } else {
        setError(result.message || 'Failed to log in. Please try again.');
        addLog("❌ Login failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'An unexpected error occurred';
      setError(errorMessage);
      addLog("🔥 Exception: " + errorMessage);
    }
    setLoading(false);
  };

  const handleOTPLogin = async () => {
    if (!email) {
      setError('Please enter your email first');
      addLog("⚠️ Tried OTP login without email");
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      setShowOTP(true);
      addLog("📩 OTP login started for " + email);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to send OTP. Please try again.';
      setError(errorMessage);
      addLog("❌ OTP error: " + errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Log in to ChatterBox</h2>
        {error && <div className="error">{error}</div>}
        
        {!showOTP ? (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <button disabled={loading} type="submit" className="login-btn">
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            
            <div className="auth-divider">
              <span>Or</span>
            </div>
            
            <GoogleAuth />
            
            <button 
              className="otp-btn" 
              onClick={handleOTPLogin}
              disabled={loading || !email}
            >
              {loading ? 'Sending OTP...' : 'Login with OTP'}
            </button>
            
            <div className="auth-link">
              Need an account? <Link to="/register">Sign up</Link>
            </div>
          </>
        ) : (
          <OTPVerification />
        )}

        {/* Debug Console Panel */}
        <DebugConsole logs={logs} />
      </div>
    </div>
  );
};

export default Login;
