import React, { useContext, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import '../styles/bottom-nav.css'
import { AuthContext } from '../context/AuthContext'

const BottomNav = () => {
  const { loggedUserId } = useContext(AuthContext)
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateActive = location.pathname.startsWith('/create');

  const handleCreateClick = (e) => {
    fileInputRef.current.click()
  }
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    const MAX_SIZE_20MB = 20 * 1024 * 1024;
    if (file) {
      navigate('/create/details',
        {
          state: {
            selectedFile: file,
            selectedFileError: file.size > MAX_SIZE_20MB ? "Please upload vides less than 20 MB" : ""
          }
        });
    }
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Bottom">
      <div className="bottom-nav_inner">

        <NavLink to="/" end className={({ isActive }) => `bottom-nav_item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav_icon" aria-hidden="true">
            {/* home icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            </svg>
          </span>
        </NavLink>

        <button onClick={handleCreateClick} className={`bottom-nav_item ${isCreateActive ? 'is-active' : ''}`}>
          <span className="bottom-nav_icon" aria-hidden="true">
            {/* add icon */}
            <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM11 11V7H13V11H17V13H13V17H11V13H7V11H11Z"></path></svg>
          </span>
        </button>
        <input
          id="shotVideo"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          style={{ display: 'none' }}
        />

        <NavLink to="/saved" className={({ isActive }) => `bottom-nav_item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav_icon" aria-hidden="true">
            {/* bookmark icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>
          </span>
        </NavLink>

        <NavLink to={`/user/${loggedUserId}`} className={({ isActive }) => `bottom-nav_item ${isActive ? 'is-active' : ''}`}>
          <span className="bottom-nav_icon" aria-hidden="true">
            {/* profile icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" />
            </svg>
          </span>
        </NavLink>
      </div>
    </nav>
  )
}

export default BottomNav