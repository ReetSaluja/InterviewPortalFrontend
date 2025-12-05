/**
 * HEADER COMPONENT
 * 
 * This component renders the fixed top navigation bar with the Accenture logo.
 * Features:
 * - Fixed position at top of page (stays visible when scrolling)
 * - White background with subtle border
 * - Accenture logo that links to home page
 * - Profile icon and menu icon for logged-in users (Admin/Interviewer)
 * - Accessible markup with ARIA labels
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 
// Import Accenture logo image
import logo from '../../assets/AC1.png';
import { setLoggedIn } from '../Login/login'; 

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check and update user data from sessionStorage
    const checkUser = () => {
      try {
        const userData = sessionStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error reading user data from sessionStorage:', error);
        setUser(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event dispatched when login happens in same tab
    const handleUserUpdate = () => {
      checkUser();
    };

    window.addEventListener('userLoggedIn', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserUpdate);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('user');
    
    // Update global login state
    setLoggedIn(false);
    
    // Close menu
    setIsMenuOpen(false);
    
    // Clear user state
    setUser(null);
    
    // Navigate to login page
    navigate('/');
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('userLoggedOut'));
  };

  // Check if user is logged in (either Admin or Interviewer)
  const isLoggedIn = user && user.role;

  return (
    <header className="app-header">
      {/* NAVIGATION BAR - Fixed position container */}
      <nav id="header-topnav" className="navbar">
        
        {/* NAVBAR BACKGROUND - White bar with border */}
        <div className="navbar-background">
          
          {/* PRIMARY NAVIGATION - Container for logo and future nav items */}
          <div className="primary-nav">
            {/* LOGO CONTAINER - Wraps the Accenture logo */}
            <div className="acn-logo-container">
              {/* LOGO LINK - Clickable logo that navigates to home */}
              <a 
                href="/" 
                className="acn-logo"
                aria-label="Accenture Home"  /* Screen reader accessibility */
              >
                {/* LOGO ICON - Logo displayed as background image on span */}
                {/* Using background-image allows for better control and cleaner HTML */}
                <span className="acn-logo-icon" 
                      style={{ backgroundImage: `url(${logo})` }}>
                </span> 
              </a>
            </div>
            {/* Future navigation links would be added here */}
            
            {/* PROFILE AND MENU ICONS - Displayed for logged-in users (Admin/Interviewer) */}
            {isLoggedIn && (
              <div className="header-right-icons" ref={menuRef}>
                {/* PROFILE ICON - User profile icon */}
                <button 
                  className="profile-icon-button"
                  aria-label="User Profile"
                  type="button"
                >
                  <svg 
                    className="profile-icon" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="8" r="4" fill="#1a73e8"/>
                    <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#1a73e8" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
                
                {/* MENU ICON - Hamburger menu icon with dropdown */}
                <div className="menu-container">
                  <button 
                    className={`menu-icon-button ${isMenuOpen ? 'active' : ''}`}
                    aria-label="Menu"
                    aria-expanded={isMenuOpen}
                    type="button"
                    onClick={toggleMenu}
                  >
                    <svg 
                      className="menu-icon" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="3" y1="6" x2="21" y2="6" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="3" y1="12" x2="21" y2="12" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="3" y1="18" x2="21" y2="18" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  
                  {/* DROPDOWN MENU - Shows user name and experience */}
                  {isMenuOpen && (
                    <div className="menu-dropdown">
                      <div className="menu-dropdown-content">
                        {/* USER NAME */}
                        <div className="menu-item">
                          <span className="menu-label">Name:</span>
                          <span className="menu-value">
                            {user?.name || user?.full_name || user?.username || user?.email || 'N/A'}
                          </span>
                        </div>
                        
                        {/* USER EXPERIENCE */}
                        <div className="menu-item">
                          <span className="menu-label">Experience:</span>
                          <span className="menu-value">
                            {user?.experience 
                              ? `${user.experience} ${user.experience === 1 ? 'year' : 'years'}`
                              : user?.experience_years 
                              ? `${user.experience_years} ${user.experience_years === 1 ? 'year' : 'years'}`
                              : 'N/A'}
                          </span>
                        </div>
                        
                        {/* LOGOUT BUTTON */}
                        <div className="menu-item menu-item-logout">
                          <button 
                            className="logout-button"
                            onClick={handleLogout}
                            type="button"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;