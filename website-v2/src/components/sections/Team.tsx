import React from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import './Team.css';

interface TeamMember {
  name: string;
  position: string;
  image: string;
  bio: string;
}

const Team: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Ms Sujani Athukorala",
      position: "Co-Founder & Managing Director",
      image: require('../../assets/placeholder.jpeg'),
      bio: "A visionary entrepreneur and the creative force behind Centillion, Ms Athukorala conceptualised the company's unique multi-sector tourism model. Her deep understanding of beauty, wellness, and customer experience drives the company's focus on innovation and client care."
    },
    {
      name: "Mr Roshan Pereira",
      position: "Co-Founder & Director (Hospitality Operations)",
      image: require('../../assets/placeholder.jpeg'),
      bio: "With over a decade of experience in hotel management and tourism, Mr. Pereira brings operational strength, professionalism, and industry connections to Centillion. His background ensures every Centillion package meets international standards of service and comfort."
    }
  ];

  return (
    <section id="team" className="team-section">
      <div className="team-container">
        <h2 className="section-title">Leadership Team</h2>
        
        <p className="team-intro">
          Meet the passionate professionals behind Centillion Gateway who bring decades of 
          combined experience in hospitality, tourism, and wellness.
        </p>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-image-container">
                <div className="member-image-wrapper">
                  <img src={member.image} alt={member.name} className="member-image" />
                </div>
                <div className="member-overlay">
                  <div className="social-links">
                    <a href="https://www.linkedin.com/company/centillion-gateway" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                      <span>
                        {/* @ts-ignore */}
                        <FaLinkedinIn />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-position">{member.position}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="team-values">
          <h3>Our Promise to You</h3>
          <p>
            Our leadership team is committed to personally ensuring that every client receives 
            the exceptional service and life-changing experiences that Centillion Gateway promises. 
            We're not just building a business; we're creating meaningful connections and transformative 
            journeys for each of our valued clients.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Team;
