import React from "react";
import "./Footer.css";
import AC2 from "../../assets/AC2.svg";

const NAV_LINKS = [
  { label: "ABOUT US", href: "#" },
  { label: "CONTACT US", href: "#" },
  { label: "CAREERS", href: "#" },
  { label: "LOCATIONS", href: "#" },
];

const Footer = () => {
  return (
    <>


      {/* MAIN FOOTER */}
      <footer className="site-footer" aria-labelledby="footer-heading">
        <div className="footer-top">

          {/* LEFT: Accenture Icon */}
          <div className="footer-logo">
            <img src={AC2} className="accenture-icon" alt="Accenture Icon" />
          </div>

          {/* CENTER: NAVIGATION */}
          <div className="footer-center">
            <nav className="footer-nav" aria-label="Footer Navigation">
              <div className="nav-inner">
                {NAV_LINKS.map((lnk) => (
                  <a key={lnk.label} href={lnk.href} className="footer-link">
                    {lnk.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* RIGHT: SOCIAL ICONS */}
          <div className="footer-social" aria-label="Social links">
            {/* LinkedIn */}
            <a href="#" className="social-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.6" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                <path d="M6 9v8"></path>
                <path d="M6 7a2 2 0 110-4 2 2 0 010 4z"></path>
                <path d="M10 13v4"></path>
                <path d="M10 9v1"></path>
                <path d="M14 13v4"></path>
              </svg>
            </a>

            {/* Twitter */}
            <a href="#" className="social-btn" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M22 5.92a7.48 7.48 0 01-2.14.59 3.73 3.73 0 001.63-2.05 7.47 7.47 0 01-2.36.9A3.73 3.73 0 0012.2 6.1c0 .29.03.57.09.84A10.6 10.6 0 013.16 4.15a3.7 3.7 0 00-.5 1.87 3.73 3.73 0 001.66 3.1 3.66 3.66 0 01-1.69-.46v.05a3.73 3.73 0 002.99 3.65 7.48 7.48 0 01-1.43.18 3.74 3.74 0 003.48 2.6A7.48 7.48 0 012 19.54 10.57 10.57 0 008.23 21c6.27 0 9.71-5.2 9.71-9.71v-.44A6.88 6.88 0 0022 5.92z" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="#" className="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.3c0-2.2 1.3-3.5 3.3-3.5.95 0 1.95.17 1.95.17v2.1h-1.1c-1.08 0-1.42.67-1.42 1.36v1.6h2.4l-.38 2.9h-2v7A10 10 0 0022 12z" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="#" className="social-btn" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M23.5 6.2s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1-3-.2-7.5-.2-7.5-.2h-.1s-4.5 0-7.5.2c-.4.1-1.3.1-2.1 1-.7.7-.9 2.3-.9 2.3S0 8 0 9.8v2.4C0 14 0.7 15.6 0.7 15.6s.2 1.6.9 2.3c.8.9 1.8.9 2.2 1 1.6.1 6.8.2 6.8.2s4.5 0 7.5-.2c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.7-2.2.7-4v-2.4c0-1.8-.7-3.6-.7-3.6zM9.8 15.1V8.7l5.6 3.2-5.6 3.2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* DIVIDER */}
        <hr className="footer-divider" />

      </footer>
    </>
  );
};

export default Footer;
