import React, { useEffect, useState } from 'react';

// Layout Components
import NavbarNew from './components/layout/NavbarNew';
import FooterNew from './components/layout/FooterNew';

// Section Components
import HeroNew from './components/sections/HeroNew';
import AboutNew from './components/sections/AboutNew';
import ServicesNew from './components/sections/ServicesNew';
import DestinationsNew from './components/sections/DestinationsNew';
import TeamNew from './components/sections/TeamNew';
import ContactNew from './components/sections/ContactNew';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Centillion Gateway
            </span>
          </h1>
          <div className="mx-auto h-1 w-64 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NavbarNew />
      <HeroNew />
      <AboutNew />
      <ServicesNew />
      <DestinationsNew />
      <TeamNew />
      <ContactNew />
      <FooterNew />
    </div>
  );
}

export default App;
