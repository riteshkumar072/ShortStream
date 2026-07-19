import React, { useContext, useState } from 'react';
import '../../styles/auth-shared.css';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const { setLoggedUserId } = useContext(AuthContext)
  const [registerError, setRegisterError] = useState("")

  const NAME_LIMIT = 30;
  const isNameOverLimit = name.length > NAME_LIMIT;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)

    const response = await apiClient.post("auth/register", {
      name,
      email,
      password,
    })
      .then(response => {
        setLoggedUserId(response.data.user._id)
        navigate("/");
      })
      .catch(error => {
        if (error.response?.status === 400) {
          setRegisterError(error.response.data.message)
        }
      }).finally(() => {
        setIsSubmitting(false)
      })
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="register-title">
        <header>
          <h1 id="register-title" className="auth-title">Sign up</h1>
        </header>

        {/* On any error occurr */}
        {registerError && (
          <div className="error-line">
            <p>{registerError}</p>
          </div>
        )}



        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="two-col">
            <div className="field-group">
              <label htmlFor="name">Name</label>
              <input className={`${isNameOverLimit ? 'error-border' : ''}`} onChange={(e) => setName(e.target.value)} id="name" name="name" placeholder="Enter your name" autoComplete="name" />
              {isNameOverLimit && (
                <div className={`counter-text ${isNameOverLimit ? 'error-text' : ''}`}>
                  Name should not more than 30  character
                </div>)}
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" placeholder="user@example.com" autoComplete="email" />
          </div>


          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create password" autoComplete="new-password" />

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

          <button disabled={!name.trim() || !email.trim() || !password.trim() || isSubmitting || isNameOverLimit} className="auth-submit" type="submit">
            {/* SPINER-APP.CSS */}
            {isSubmitting ? (
              <span className="spinner-loader"></span>
            ) : (
              "Create Account"
            )}
          </button>


        </form>
        <div className="auth-alt-action">
          Already a user? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;