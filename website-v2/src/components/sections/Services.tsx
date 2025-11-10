import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaSpa, FaGraduationCap, FaTrophy } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './Services.css';

// Icon components with proper typing for React 19
// @ts-ignore - React Icons compatibility with React 19
const HeartbeatIcon: React.FC = () => <FaHeartbeat />;
// @ts-ignore
const SpaIcon: React.FC = () => <FaSpa />;
// @ts-ignore
const GraduationIcon: React.FC = () => <FaGraduationCap />;
// @ts-ignore
const TrophyIcon: React.FC = () => <FaTrophy />;

interface ServiceInfo {
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
}

const Services: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>(null);
  
  const services: ServiceInfo[] = [
    {
      title: "Medical Tourism",
      icon: <HeartbeatIcon />,
      description: "World-class medical and cosmetic treatments with accredited hospitals and clinics in India, Thailand, and Sri Lanka.",
      details: [
        "Cosmetic & plastic surgery with leading specialists",
        "Dental treatments at state-of-the-art facilities",
        "Fertility treatments with high success rates",
        "Wellness & recovery programs for post-treatment care",
        "End-to-end service from consultation to recovery tours"
      ]
    },
    {
      title: "Wellness Tourism",
      icon: <SpaIcon />,
      description: "Rejuvenate your mind and body with curated wellness journeys that blend natural healing with cultural exploration.",
      details: [
        "Traditional Ayurvedic retreats in Sri Lanka",
        "Yoga and meditation programs led by experienced practitioners",
        "Thai wellness and detox experiences",
        "Spa and relaxation packages in scenic locations",
        "Customized wellness itineraries for complete rejuvenation"
      ]
    },
    {
      title: "Education & Training",
      icon: <GraduationIcon />,
      description: "International student training programs that build global skills and exposure through practical experience.",
      details: [
        "Hospitality & tourism internships with industry leaders",
        "Beauty and health-related training programs",
        "Language and vocational skills development",
        "Cultural immersion and exchange opportunities",
        "Certification courses with recognized institutions"
      ]
    },
    {
      title: "Sports Tourism",
      icon: <TrophyIcon />,
      description: "Comprehensive sports travel packages for teams, schools, and enthusiasts seeking excellence and adventure.",
      details: [
        "Sports training camps (cricket, athletics, martial arts)",
        "Tournament participation and friendly matches",
        "Combined sports and cultural travel experiences",
        "Team-building and leadership development programs",
        "Access to world-class coaching and facilities"
      ]
    }
  ];
  
  const toggleService = (title: string) => {
    if (activeService === title) {
      setActiveService(null);
    } else {
      setActiveService(title);
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2 className="section-title">Our Services</h2>
        
        <p className="services-intro">
          At Centillion Gateway, we specialize in creating transformative travel experiences 
          that combine healthcare, wellness, education, and sports with cultural immersion.
        </p>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className={`service-item ${activeService === service.title ? 'active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                title={service.title} 
                icon={
                  <motion.span 
                    className="service-icon icon-3d"
                    whileHover={{ scale: 1.1, rotateY: 15 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {service.icon}
                  </motion.span>
                }
                className="service-card"
                hoverEffect={false}
              >
                <p className="service-description">{service.description}</p>
                
                <motion.div 
                  className={`service-details ${activeService === service.title ? 'visible' : ''}`}
                  initial={false}
                  animate={{ 
                    height: activeService === service.title ? 'auto' : 0,
                    opacity: activeService === service.title ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ul>
                    {service.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </motion.div>
                
                <Button 
                  variant="outline" 
                  size="small"
                  className="service-button"
                  onClick={() => toggleService(service.title)}
                >
                  {activeService === service.title ? 'Show Less' : 'Learn More'}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="services-cta">
          <h3>Ready to experience our services?</h3>
          <Button 
            variant="primary" 
            size="large"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Request a Custom Package
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
