import React from 'react';
import './About.css';
import Card from '../ui/Card';

const About: React.FC = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">About Us</h2>
        
        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              Centillion Gateway Pvt Ltd is a Sri Lanka–based tourism company that specialises in medical, wellness, education, and sports tourism, connecting travellers and students with life-changing experiences across Sri Lanka, India, and Thailand.
            </p>
            
            <p className="about-description">
              Founded by two passionate professionals with over a decade of experience in the hospitality and tourism industry, Centillion was born from a simple yet powerful idea — to create international travel programs that offer infinite value and unforgettable experiences, while remaining affordable to everyone.
            </p>
            
            <p className="about-description">
              The name Centillion, inspired by one of the world's largest numerical values, reflects the company's belief that while the cost of each package is small, the experience delivered is as grand as a Centillion.
            </p>
          </div>
          
          <div className="about-image-container">
            <div className="about-image">
              <img src={require('../../assets/placeholder.jpeg')} alt="Centillion Gateway" />
            </div>
          </div>
        </div>
        
        <div className="mission-vision-section">
          <div className="mission-vision-container">
            <div className="mission-card">
              <h3>Our Vision</h3>
              <p>
                To position Sri Lanka as a leading regional hub for medical, wellness, educational, and sports tourism, by connecting people with trusted institutions and world-class experiences across Asia.
              </p>
            </div>
            
            <div className="mission-card">
              <h3>Our Mission</h3>
              <p>
                To offer affordable, reliable, and enriching travel programs that combine care, knowledge, and culture — enabling our clients to improve their health, skills, and overall well-being through seamless, guided journeys.
              </p>
            </div>
          </div>
        </div>
        
        <div className="values-section">
          <h3 className="values-title">Our Core Values</h3>
          
          <div className="values-grid">
            <Card title="Integrity" className="value-card">
              We build trust through transparency and honesty.
            </Card>
            
            <Card title="Care" className="value-card">
              Our guests' comfort, safety, and satisfaction come first.
            </Card>
            
            <Card title="Excellence" className="value-card">
              We partner only with accredited institutions and professionals.
            </Card>
            
            <Card title="Innovation" className="value-card">
              We constantly create new cross-border tourism concepts.
            </Card>
            
            <Card title="Empowerment" className="value-card">
              We believe travel and learning can transform lives.
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
