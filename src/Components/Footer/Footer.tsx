/**
 * FOOTER COMPONENT
 * 
 * This component renders the site footer with:
 * - Accenture logo (left)
 * - Navigation links (center): About Us, Contact Us, Careers, Locations
 * - Social media icons (right): LinkedIn, Twitter, Facebook, YouTube
 * - Divider line
 * - Legal links and copyright (bottom)
 * 
 * Layout: Three-column grid on desktop, stacks on mobile
 * Styling: Black background with white text
 */

import "./Footer.css";
import AC2 from "../../assets/AC2.svg";
// Import social media icons from react-icons library
import { FaLinkedin, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

/* NAVIGATION LINKS - Main footer navigation items */
const NAV_LINKS = [
  { label: "ABOUT US", href: "#" },
  { label: "CONTACT US", href: "#" },
  { label: "CAREERS", href: "#" },
  { label: "LOCATIONS", href: "#" },
];

/* LEGAL LINKS - Footer bottom legal/policy links */
const LEGAL_LINKS = [
  { label: "Privacy Statement", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "Accessibility Statement", href: "#" },
];

/* SOCIAL MEDIA LINKS - Icons with links to social platforms */
const SOCIAL_LINKS = [
  { 
    name: "LinkedIn", 
    href: "#",
    icon: <FaLinkedin />  /* React icon component */
  },
  { 
    name: "Twitter", 
    href: "#",
    icon: <FaTwitter />
  },
  { 
    name: "Facebook", 
    href: "#",
    icon: <FaFacebook />
  },
  { 
    name: "YouTube", 
    href: "#",
    icon: <FaYoutube />
  },
];

const Footer = () => {
  return (
    <>
      {/* MAIN FOOTER CONTAINER - Full-width black footer */}
      <footer className="site-footer" aria-labelledby="footer-heading">
        {/* FOOTER TOP SECTION - Logo, nav links, and social icons */}
        <div className="footer-top">
          {/* LEFT COLUMN: Accenture Logo */}
          <div className="footer-logo">
            <img src={AC2} className="accenture-icon" alt="Accenture Icon" />
          </div>

          {/* CENTER COLUMN: Navigation Links */}
          <div className="footer-center">
            <nav className="footer-nav" aria-label="Footer Navigation">
              <div className="nav-inner">
                {/* Map through NAV_LINKS to render each navigation link */}
                {NAV_LINKS.map((lnk) => (
                  <a key={lnk.label} href={lnk.href} className="footer-link">
                    {lnk.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* RIGHT COLUMN: Social Media Icons */}
          <div className="footer-social">
            {/* Map through SOCIAL_LINKS to render each social icon */}
            {SOCIAL_LINKS.map((social) => (
              <a 
                key={social.name} 
                href={social.href} 
                className="social-icon-link"
                aria-label={social.name}  /* Accessibility label */
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* DIVIDER LINE - Separates top and bottom sections */}
        <hr className="footer-divider" />

        {/* FOOTER BOTTOM SECTION - Legal links and copyright */}
        <div className="footer-bottom">
          {/* LEFT: Legal/Policy Links */}
          <div className="legal-links">
            {/* Map through LEGAL_LINKS to render each legal link */}
            {LEGAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="legal-link">
                {link.label}
              </a>
            ))}
          </div>
          {/* RIGHT: Copyright Text */}
          <div className="footer-copyright">
            © 2025 Accenture. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
