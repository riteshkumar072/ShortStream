import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/auth-shared.css';
import apiClient from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const { setLoggedUserId } = useContext(AuthContext)
  const [loginError, setLoginError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();

    setIsSubmitting(true)

    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password
      });

      setLoggedUserId(response.data.user._id)
      navigate("/");

    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        setLoginError(error.response.data.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  };


  const handleGuestLogin = async () => {
    try {
      const response = await apiClient.post('/auth/guest',)
      if (response.data.success) {
        setLoggedUserId(response.data.user._id)
        navigate("/");
      }
    } catch (error) {
      console.error("Guise login successfully")
    }
  }

  
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="login-title">
        <header>
          <h1 id="login-title" className="auth-title">Login</h1>
        </header>

        {/* On any error occurr- app.css */}
        {loginError && (
          <div className="error-line">
            <p>{loginError}</p>
          </div>
        )}


        <form className="auth-form" onSubmit={handleLogin} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" autoComplete="email" />
          </div>


          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input id="password" name="password" onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter password" autoComplete="new-password" />

              <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>


          <button className="auth-submit" type="submit" disabled={!email.trim() || !password.trim() || isSubmitting}>
            {isSubmitting ? (
              //SPINER-APP.CSS
              <span className="spinner-loader"></span>
            ) : (
              "Log in"
            )}
          </button>
        </form>
          <button type='guest-login' onClick={handleGuestLogin} className="guest-login-btn">
            Explore as Guest
          </button>

        <div className="auth-alt-action">
          New user? <a href="/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;