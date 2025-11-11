import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Check } from 'lucide-react';

interface DestinationInfo {
  name: string;
  flag: string;
  image: string;
  description: string;
  highlights: string[];
}

const DestinationsNew: React.FC = () => {
  const [activeDestination, setActiveDestination] = useState<number>(0);
  
  const destinations: DestinationInfo[] = [
    {
      name: "Sri Lanka",
      flag: "🇱🇰",
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
      flag: "🇮🇳",
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
      flag: "🇹🇭",
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

  return (
    <section id="destinations" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <MapPin className="mr-1 h-3 w-3" />
            Our Destinations
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Carefully Selected Destinations
          </h2>
          <p className="text-lg text-muted-foreground">
            We carefully selected our destinations to offer you the perfect blend of high-quality services, 
            authentic cultural experiences, and exceptional value.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {destinations.map((destination, index) => (
              <Button
                key={index}
                variant={activeDestination === index ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveDestination(index)}
                className="min-w-[140px]"
              >
                <span className="mr-2 text-xl">{destination.flag}</span>
                {destination.name}
              </Button>
            ))}
          </div>
          
          {/* Content */}
          <Card className="overflow-hidden border-2 shadow-2xl">
            <div className="grid gap-0 lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={destinations[activeDestination].image} 
                  alt={destinations[activeDestination].name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-r"></div>
                <div className="absolute bottom-6 left-6">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <span className="mr-2 text-2xl">{destinations[activeDestination].flag}</span>
                    {destinations[activeDestination].name}
                  </Badge>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-8 lg:p-12">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl">
                    Discover {destinations[activeDestination].name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0 space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {destinations[activeDestination].description}
                  </p>
                  
                  <div>
                    <h4 className="mb-4 font-semibold text-lg">Highlights</h4>
                    <ul className="space-y-3">
                      {destinations[activeDestination].highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    size="lg"
                    className="w-full"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore {destinations[activeDestination].name} Packages
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
          
          {/* Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              All our destinations feature carefully selected partners and institutions that meet our strict quality standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsNew;

