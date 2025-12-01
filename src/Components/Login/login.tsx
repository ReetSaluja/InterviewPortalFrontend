import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { STATIC_USER_CREDENTIALS } from '../data'; 

export let isLoggedIn: boolean = false;

const setLoggedIn = (status: boolean) => {
    isLoggedIn = status;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. ADD STATE FOR ERROR MESSAGE
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalMargin = document.body.style.margin;
    const originalPadding = document.body.style.padding;
    
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.margin = originalMargin;
      document.body.style.padding = originalPadding;
    };
  }, []);

  // STATIC AUTHENTICATION HANDLER: Checks credentials and redirects on success.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error message on every submission attempt
    setError(null);

    if (
      email === STATIC_USER_CREDENTIALS.email && 
      password === STATIC_USER_CREDENTIALS.password
    ) {
      // SUCCESS: Set the static session flag and redirect
      console.log('Static Login Successful! Setting session and redirecting...');
      setLoggedIn(true); // Log in action
      navigate('/add-interview'); 
    } else {
      // FAILURE: Display error message to the user
      console.log('Login Failed: Incorrect email or password.');
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          
          {/* 2. DISPLAY ERROR MESSAGE ABOVE THE FORM */}
          {error && <div className="error-message">{error}</div>}

          {/* E-MAIL FIELD */}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Enter e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* PASSWORD FIELD WITH FORGOT LINK */}
          <div className="form-group">
            <div className="label-container">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;