import React from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiMail, HiPhone, HiClock } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Contact.css';
import ContactForm from './ContactForm';

// Icon components with proper typing for React 19
// @ts-ignore - React Icons compatibility with React 19
const LocationIcon: React.FC = () => <HiLocationMarker />;
// @ts-ignore
const MailIcon: React.FC = () => <HiMail />;
// @ts-ignore
const PhoneIcon: React.FC = () => <HiPhone />;
// @ts-ignore
const ClockIcon: React.FC = () => <HiClock />;
// @ts-ignore
const FacebookIcon: React.FC = () => <FaFacebookF />;
// @ts-ignore
const InstagramIcon: React.FC = () => <FaInstagram />;
// @ts-ignore
const LinkedInIcon: React.FC = () => <FaLinkedinIn />;

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="section-title">Start Your Journey Today</h2>
        
        <p className="contact-intro">
          Let us create a personalized package that fulfills your Centillion wishes. Complete the form below, and our team will get back to you within 24 hours.
        </p>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <h3>Contact Information</h3>
              
              <motion.div 
                className="info-item"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="info-icon icon-3d"
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <LocationIcon />
                </motion.div>
                <div className="info-content">
                  <h4>Head Office</h4>
                  <p>Piliyandala, Sri Lanka</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="info-item"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="info-icon icon-3d"
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <MailIcon />
                </motion.div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>info@centilliongateway.com</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="info-item"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="info-icon icon-3d"
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <PhoneIcon />
                </motion.div>
                <div className="info-content">
                  <h4>Phone</h4>
                  <p>+94 123 456 789</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="info-item"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="info-icon icon-3d"
                  whileHover={{ scale: 1.1, rotateY: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ClockIcon />
                </motion.div>
                <div className="info-content">
                  <h4>Business Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </motion.div>
              
              <div className="contact-social">
                <h4>Connect With Us</h4>
                <div className="social-links">
                  <motion.a 
                    href="https://facebook.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon icon-3d" 
                    aria-label="Facebook"
                    whileHover={{ scale: 1.15, rotateY: 15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FacebookIcon />
                  </motion.a>
                  <motion.a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon icon-3d" 
                    aria-label="Instagram"
                    whileHover={{ scale: 1.15, rotateY: 15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <InstagramIcon />
                  </motion.a>
                  <motion.a 
                    href="https://linkedin.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon icon-3d" 
                    aria-label="LinkedIn"
                    whileHover={{ scale: 1.15, rotateY: 15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <LinkedInIcon />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
