import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, RegisterData } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Mail, Phone, Clock, CheckCircle2, Facebook, Instagram, Linkedin, AlertCircle, Copy } from 'lucide-react';

const ContactNew: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    email: '',
    age: '',
    phone: '',
    country: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = register(formData);
    if (result.success) {
      setTempPassword(result.tempPassword);
      setFormSubmitted(true);
      window.scrollTo({ top: document.getElementById('contact')?.offsetTop, behavior: 'smooth' });
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Head Office",
      content: "Piliyandala, Sri Lanka"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      content: "info@centilliongateway.com"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      content: "+94 123 456 789"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Business Hours",
      content: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 9:00 AM - 1:00 PM"]
    }
  ];

  if (formSubmitted) {
    return (
      <section id="contact" className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Account Created Successfully!</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Welcome to Centillion Gateway! Your account has been created with a temporary password.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Important: Save Your Temporary Password
                  </p>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-3 rounded border border-yellow-300 dark:border-yellow-700">
                    <code className="flex-1 text-lg font-mono">{tempPassword}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyPassword}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    Please save this password. You will need it to log in and will be asked to change it on your first login.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{formData.fullName}</span>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => navigate('/login')}
              >
                Continue to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Badge variant="outline" className="mb-4">Get Started</Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Create Your Account
          </h2>
          <p className="text-lg text-muted-foreground">
            Register to access our comprehensive beauty enhancement services. Fill out the form below to create your account.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch with us</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{info.title}</h4>
                        {Array.isArray(info.content) ? (
                          info.content.map((line, i) => (
                            <p key={i} className="text-sm text-muted-foreground">{line}</p>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">{info.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Social Links */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-sm mb-3">Connect With Us</h4>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="outline" asChild>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="icon" variant="outline" asChild>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="icon" variant="outline" asChild>
                        <a href="https://linkedin.com/company/centillion-gateway" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Registration Form</CardTitle>
                  <CardDescription>Fill out your basic information to create an account</CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          placeholder="25"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+94 123 456 789"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country of Residence *</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        placeholder="Sri Lanka"
                      />
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-4">
                        After registration, you'll receive a temporary password. You'll be able to complete the detailed treatment form after logging in to your account.
                      </p>
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                      <div className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{' '}
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate('/login')}
                        >
                          Login here
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactNew;

