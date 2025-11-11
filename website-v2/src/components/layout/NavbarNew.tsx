import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ModeToggle } from '../ui/mode-toggle';

const NavbarNew: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#destinations', label: 'Destinations' },
    { href: '#team', label: 'Our Team' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Centillion Gateway
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Theme Toggle & CTA Button (Desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <ModeToggle />
            <Button
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Start Your Journey
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t md:hidden bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="block px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <ModeToggle />
              <Button
                className="flex-1"
                onClick={() => {
                  handleLinkClick();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarNew;

