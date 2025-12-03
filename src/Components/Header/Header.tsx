import React from 'react';
import './Header.css'; 
// Use the corrected relative path
import logo from '../../assets/AC1.png'; 

const Header: React.FC = () => {
  return (
    <header className="app-header">
      {/* Parent nav for fixed position, though we'll only style the child */}
      <nav id="header-topnav" className="navbar">
        
        {/* The White Visual Bar - styles will be in Header.css */}
        <div className="navbar-background">
          
          {/* Container for the actual content/logo */}
          <div className="primary-nav">
            <div className="acn-logo-container">
              <a 
                href="/" 
                className="acn-logo"
                aria-label="Accenture Home" 
              >
                {/* Use an accessible span. The logo will be applied to this span 
                  via CSS background-image for cleaner HTML.
                */}
                <span className="acn-logo-icon" 
                      style={{ backgroundImage: `url(${logo})` }}>
                </span> 
              </a>
            </div>
            {/* Other navigation links would go here */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;