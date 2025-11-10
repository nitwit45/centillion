import React, { useState } from 'react';
import './Destinations.css';
import Button from '../ui/Button';

interface DestinationInfo {
  name: string;
  image: string;
  description: string;
  highlights: string[];
}

const Destinations: React.FC = () => {
  const [activeDestination, setActiveDestination] = useState<number>(0);
  
  const destinations: DestinationInfo[] = [
    {
      name: "Sri Lanka",
      image: require('../../assets/placeholder.jpeg'),
      description: "Discover the island of serenity where ancient healing traditions meet lush landscapes and vibrant culture.",
      highlights: [
        "World-renowned Ayurvedic wellness centers",
        "State-of-the-art sports training facilities",
        "Student programs with cultural immersion",
        "Spectacular natural settings for recovery and rejuvenation",
        "Rich heritage sites and cultural experiences"
      ]
    },
    {
      name: "India",
      image: require('../../assets/placeholder.jpeg'),
      description: "Experience the birthplace of holistic medicine and a hub for specialized medical treatments and educational excellence.",
      highlights: [
        "Leading medical facilities with international accreditation",
        "Premier vocational training institutions",
        "Educational hubs with specialized programs",
        "Traditional and modern healing approaches",
        "Cultural diversity and historical wonders"
      ]
    },
    {
      name: "Thailand",
      image: require('../../assets/placeholder.jpeg'),
      description: "Embrace the perfect blend of world-class medical care, wellness traditions, and tropical paradise settings.",
      highlights: [
        "Internationally acclaimed cosmetic and medical centers",
        "Luxury wellness retreats in pristine locations",
        "Holistic health and beauty treatments",
        "Exceptional hospitality training opportunities",
        "Tropical beaches and vibrant cultural experiences"
      ]
    }
  ];
  
  const handleDestinationChange = (index: number) => {
    setActiveDestination(index);
  };

  return (
    <section id="destinations" className="destinations-section">
      <div className="destinations-container">
        <h2 className="section-title">Our Destinations</h2>
        
        <p className="destinations-intro">
          We carefully selected our destinations to offer you the perfect blend of high-quality services, 
          authentic cultural experiences, and exceptional value.
        </p>
        
        <div className="destinations-tabs">
          {destinations.map((destination, index) => (
            <button 
              key={index}
              className={`destination-tab ${activeDestination === index ? 'active' : ''}`}
              onClick={() => handleDestinationChange(index)}
            >
              {destination.name}
            </button>
          ))}
        </div>
        
        <div className="destination-content">
          <div className="destination-image-container">
            <img 
              src={destinations[activeDestination].image} 
              alt={destinations[activeDestination].name} 
              className="destination-image"
            />
          </div>
          
          <div className="destination-info">
            <h3 className="destination-name">{destinations[activeDestination].name}</h3>
            <p className="destination-description">{destinations[activeDestination].description}</p>
            
            <div className="destination-highlights">
              <h4>Highlights</h4>
              <ul>
                {destinations[activeDestination].highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
            
            <Button 
              variant="primary" 
              className="destination-button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore {destinations[activeDestination].name} Packages
            </Button>
          </div>
        </div>
        
        <div className="destinations-note">
          <p>All our destinations feature carefully selected partners and institutions that meet our strict quality standards.</p>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
