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
  { label: "ABOUT US", href: "https://www.accenture.com/us-en/about/company-index" },
  { label: "CONTACT US", href: "https://www.accenture.com/in-en/about/contact-us" },
  { label: "CAREERS", href: "https://www.accenture.com/in-en/careers" },
  { label: "LOCATIONS", href: "https://www.accenture.com/in-en/about/location" },
];

/* LEGAL LINKS - Footer bottom legal/policy links */
const LEGAL_LINKS = [
  { label: "Privacy Statement", href: "https://www.accenture.com/in-en/support/privacy-policy" },
  { label: "Terms & Conditions", href: "https://www.accenture.com/in-en/terms-of-use" },
  { label: "Cookie Policy", href: "https://www.accenture.com/us-en/support/company-cookies-similar-technology" },
  { label: "Accessibility Statement", href: "https://www.accenture.com/us-en/support/accessibility-statement" },
];

/* SOCIAL MEDIA LINKS - Icons with links to social platforms */
const SOCIAL_LINKS = [
  { 
    name: "LinkedIn", 
    href: "https://www.linkedin.com/company/accenture/",
    icon: <FaLinkedin />  /* React icon component */
  },
  { 
    name: "Twitter", 
    href: "https://www.linkedin.com/company/accenture/",
    icon: <FaTwitter />
  },
  { 
    name: "Facebook", 
    href: "https://www.facebook.com/accenture",
    icon: <FaFacebook />
  },
  { 
    name: "YouTube", 
    href: "https://www.youtube.com/user/Accenture",
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
            <a href="https://www.accenture.com/in-en" target="_blank" rel="noopener noreferrer" aria-label="Visit Accenture India">
              <img src={AC2} className="accenture-icon" alt="Accenture Icon" />
            </a>
          </div>

          {/* CENTER COLUMN: Navigation Links */}
          <div className="footer-center">
            <nav className="footer-nav" aria-label="Footer Navigation">
              <div className="nav-inner">
                {/* Map through NAV_LINKS to render each navigation link */}
                {NAV_LINKS.map((lnk) => (
                  <a 
                    key={lnk.label} 
                    href={lnk.href} 
                    className="footer-link"
                    {...(lnk.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
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
                {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
              <a 
                key={link.label} 
                href={link.href} 
                className="legal-link"
                {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
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
