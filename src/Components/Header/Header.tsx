/**
 * HEADER COMPONENT
 * 
 * This component renders the fixed top navigation bar with the Accenture logo.
 * Features:
 * - Fixed position at top of page (stays visible when scrolling)
 * - White background with subtle border
 * - Accenture logo that links to home page
 * - Accessible markup with ARIA labels
 */

import React from 'react';
import './Header.css'; 
// Import Accenture logo image
import logo from '../../assets/AC1.png'; 

const Header: React.FC = () => {
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;