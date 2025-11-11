import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Heart, Sparkles, GraduationCap, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceInfo {
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  badge: string;
}

const ServicesNew: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>(null);
  
  const services: ServiceInfo[] = [
    {
      title: "Medical Tourism",
      icon: <Heart className="h-8 w-8" />,
      badge: "Healthcare",
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
      icon: <Sparkles className="h-8 w-8" />,
      badge: "Wellness",
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
      icon: <GraduationCap className="h-8 w-8" />,
      badge: "Education",
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
      icon: <Trophy className="h-8 w-8" />,
      badge: "Sports",
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
    setActiveService(activeService === title ? null : title);
  };

  return (
    <section id="services" className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <Badge variant="outline" className="mb-4">Our Services</Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Transformative Travel Experiences
        </h2>
        <p className="text-lg text-muted-foreground">
          We specialize in creating transformative travel experiences that combine healthcare, 
          wellness, education, and sports with cultural immersion.
        </p>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden transition-all hover:shadow-xl"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    {service.icon}
                  </div>
                  <Badge variant="secondary">{service.badge}</Badge>
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                {activeService === service.title && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <h4 className="font-semibold text-sm">What's Included:</h4>
                    <ul className="space-y-2">
                      {service.details.map((detail, i) => (
                        <li key={i} className="flex items-start text-sm text-muted-foreground">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => toggleService(service.title)}
                >
                  {activeService === service.title ? (
                    <>
                      Show Less <ChevronUp className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Learn More <ChevronDown className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* CTA */}
        <div className="mt-16 rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 text-center shadow-lg">
          <h3 className="mb-4 text-2xl font-bold">Ready to experience our services?</h3>
          <p className="mb-6 text-muted-foreground">
            Let us create a custom package tailored to your unique needs and preferences.
          </p>
          <Button 
            size="lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Request a Custom Package
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesNew;

