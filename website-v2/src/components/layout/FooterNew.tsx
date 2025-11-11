import React from 'react';
import { Button } from '../ui/button';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const FooterNew: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Medical Tourism', href: '#services' },
      { label: 'Wellness Tourism', href: '#services' },
      { label: 'Education & Training', href: '#services' },
      { label: 'Sports Tourism', href: '#services' },
    ],
    destinations: [
      { label: 'Sri Lanka', href: '#destinations' },
      { label: 'India', href: '#destinations' },
      { label: 'Thailand', href: '#destinations' },
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Team', href: '#team' },
      { label: 'Contact', href: '#contact' },
    ],
  };

  const contactInfo = [
    { icon: <MapPin className="h-4 w-4" />, text: 'Head Office: Piliyandala, Sri Lanka' },
    { icon: <Mail className="h-4 w-4" />, text: 'Email: info@centilliongateway.com' },
    { icon: <Phone className="h-4 w-4" />, text: 'Phone: +94 123 456 789' },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-4 w-4" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter className="h-4 w-4" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram className="h-4 w-4" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <Linkedin className="h-4 w-4" />, href: 'https://linkedin.com/company/centillion-gateway', label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="mb-2 text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Centillion Gateway
              </span>
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              We fulfill your Centillion wishes
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Connecting travelers with life-changing experiences across Asia through medical, 
              wellness, education, and sports tourism.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations Column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Destinations</h4>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-8 border-t pt-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {info.icon}
                </div>
                <p className="text-sm text-muted-foreground">{info.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Centillion Gateway Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;

