import React from 'react';
import Button from '../ui/Button';
import './Hero.css';

const Hero: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="gradient-text">Centillion Gateway</h1>
        <p className="tagline">We fulfill your Centillion wishes</p>
        
        <div className="hero-description">
          <p>
            Connecting travelers with life-changing experiences across Sri Lanka, India, and 
            Thailand through medical, wellness, education, and sports tourism.
          </p>
        </div>
        
        <div className="cta-container">
          <Button 
            variant="primary" 
            size="large" 
            onClick={scrollToContact}
          >
            Start Your Journey
          </Button>
          <Button 
            variant="secondary" 
            size="large" 
            onClick={scrollToServices}
          >
            Explore Services
          </Button>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div className="arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
