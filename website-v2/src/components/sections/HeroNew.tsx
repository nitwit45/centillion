import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowRight } from 'lucide-react';

const HeroNew: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm">
            🌏 Connecting You Across Sri Lanka, India & Thailand
          </Badge>
          
          {/* Main headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Centillion Gateway
            </span>
          </h1>
          
          <p className="mb-4 text-2xl font-semibold text-muted-foreground sm:text-3xl">
            We fulfill your Centillion wishes
          </p>
          
          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Connecting travelers with life-changing experiences across Asia through medical, 
            wellness, education, and sports tourism.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="group w-full sm:w-auto"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToServices}
              className="w-full sm:w-auto"
            >
              Explore Services
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Services</div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">10+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Value Delivered</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-12 w-6 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1">
          <div className="h-2 w-1 rounded-full bg-muted-foreground/50"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;

