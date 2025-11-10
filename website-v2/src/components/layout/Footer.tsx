import React from 'react';
import { HiLocationMarker, HiMail, HiPhone } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="gradient-text-logo">Centillion Gateway</h3>
            <p className="tagline">We fulfill your Centillion wishes.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Services</h4>
              <ul>
                <li><a href="#medical">Medical Tourism</a></li>
                <li><a href="#wellness">Wellness Tourism</a></li>
                <li><a href="#education">Education & Training</a></li>
                <li><a href="#sports">Sports Tourism</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Destinations</h4>
              <ul>
                <li><a href="#sri-lanka">Sri Lanka</a></li>
                <li><a href="#india">India</a></li>
                <li><a href="#thailand">Thailand</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#team">Our Team</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="contact-info">
            <p><span style={{display: 'inline', marginRight: '0.5rem'}}>
              {/* @ts-ignore */}
              <HiLocationMarker />
            </span> Head Office: Piliyandala, Sri Lanka</p>
            <p><span style={{display: 'inline', marginRight: '0.5rem'}}>
              {/* @ts-ignore */}
              <HiMail />
            </span> Email: info@centilliongateway.com</p>
            <p><span style={{display: 'inline', marginRight: '0.5rem'}}>
              {/* @ts-ignore */}
              <HiPhone />
            </span> Phone: +94 123 456 789</p>
          </div>
          
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <span>
                {/* @ts-ignore */}
                <FaFacebookF />
              </span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <span>
                {/* @ts-ignore */}
                <FaTwitter />
              </span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <span>
                {/* @ts-ignore */}
                <FaInstagram />
              </span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <span>
                {/* @ts-ignore */}
                <FaLinkedinIn />
              </span>
            </a>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; {currentYear} Centillion Gateway Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
