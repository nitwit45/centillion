import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Linkedin } from 'lucide-react';

interface TeamMember {
  name: string;
  position: string;
  image: string;
  bio: string;
}

const TeamNew: React.FC = () => {
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
    <section id="team" className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <Badge variant="outline" className="mb-4">Leadership Team</Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Meet Our Founders
        </h2>
        <p className="text-lg text-muted-foreground">
          Meet the passionate professionals behind Centillion Gateway who bring decades of 
          combined experience in hospitality, tourism, and wellness.
        </p>
      </div>

      {/* Team Grid */}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group overflow-hidden transition-all hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Social link overlay */}
                  <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="secondary"
                      asChild
                    >
                      <a 
                        href="https://www.linkedin.com/company/centillion-gateway" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="mb-2">{member.name}</CardTitle>
                <Badge variant="secondary" className="mb-4">{member.position}</Badge>
                <p className="text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Promise Section */}
        <Card className="mt-12 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Our Promise to You</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg text-muted-foreground leading-relaxed">
              Our leadership team is committed to personally ensuring that every client receives 
              the exceptional service and life-changing experiences that Centillion Gateway promises. 
              We're not just building a business; we're creating meaningful connections and transformative 
              journeys for each of our valued clients.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TeamNew;

