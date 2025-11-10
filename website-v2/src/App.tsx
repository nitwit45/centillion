import React, { useEffect, useState } from 'react';
import './App.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Section Components
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Destinations from './components/sections/Destinations';
import Team from './components/sections/Team';
import Contact from './components/sections/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <div className="loader">
          <div className="loader-content">
            <h1 className="gradient-text">Centillion Gateway</h1>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Navbar />
          <Hero />
          <About />
          <Services />
          <Destinations />
          <Team />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;