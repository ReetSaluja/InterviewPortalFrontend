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
        </div>

        {/* DIVIDER */}
        <hr className="footer-divider" />

      </footer>
    </>
  );
};

export default Footer;
