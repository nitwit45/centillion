import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  passport: string;
  destination: string;
  tourismType: string;
  specificActivities: string;
  budget: string;
  experienceLevel: string;
  additionalInfo: string;
  travelDates: string;
  referralSource: string;
  otherReferral: string;
}

const ContactNew: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    passport: '',
    destination: '',
    tourismType: '',
    specificActivities: '',
    budget: '',
    experienceLevel: '',
    additionalInfo: '',
    travelDates: '',
    referralSource: '',
    otherReferral: '',
  });

  const [step, setStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo({ top: document.getElementById('contact')?.offsetTop, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: document.getElementById('contact')?.offsetTop, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    setFormSubmitted(true);
    window.scrollTo({ top: document.getElementById('contact')?.offsetTop, behavior: 'smooth' });
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
        <Card className="mx-auto max-w-2xl border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
          <CardContent className="p-12">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Thank You!</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Your custom package request has been received. Our team will contact you shortly to discuss your personalized journey.
            </p>
            <Button
              size="lg"
              onClick={() => {
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  country: '',
                  passport: '',
                  destination: '',
                  tourismType: '',
                  specificActivities: '',
                  budget: '',
                  experienceLevel: '',
                  additionalInfo: '',
                  travelDates: '',
                  referralSource: '',
                  otherReferral: '',
                });
                setFormSubmitted(false);
                setStep(1);
              }}
            >
              Submit Another Request
            </Button>
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
          <Badge variant="outline" className="mb-4">Contact Us</Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Let us create a personalized package that fulfills your Centillion wishes. Complete the form below, 
            and our team will get back to you within 24 hours.
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

            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Package Request</CardTitle>
                  <CardDescription>Fill out the form to get started with your personalized travel package</CardDescription>
                  
                  {/* Progress Steps */}
                  <div className="mt-6 flex items-center justify-between">
                    {[1, 2, 3].map((s) => (
                      <React.Fragment key={s}>
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all",
                              step >= s
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground/30 text-muted-foreground"
                            )}
                          >
                            {s}
                          </div>
                          <span className="ml-2 hidden text-sm font-medium sm:inline">
                            {s === 1 ? "Personal" : s === 2 ? "Preferences" : "Details"}
                          </span>
                        </div>
                        {s < 3 && (
                          <div
                            className={cn(
                              "h-0.5 flex-1 mx-2 transition-all",
                              step > s ? "bg-primary" : "bg-muted-foreground/30"
                            )}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1 */}
                    {step === 1 && (
                      <div className="space-y-4">
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

                        <div className="space-y-2">
                          <Label htmlFor="passport">Passport Details (Optional)</Label>
                          <Input
                            id="passport"
                            name="passport"
                            value={formData.passport}
                            onChange={handleChange}
                            placeholder="Passport number, expiry date"
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="button" onClick={nextStep}>
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label>Preferred Destination *</Label>
                          <RadioGroup className="grid gap-3">
                            {["Sri Lanka", "Thailand", "India"].map((dest) => (
                              <div key={dest} className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem
                                  id={dest}
                                  name="destination"
                                  value={dest}
                                  checked={formData.destination === dest}
                                  onChange={handleChange}
                                  required
                                />
                                <Label htmlFor={dest} className="cursor-pointer flex-1">
                                  {dest}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Type of Tourism *</Label>
                          <RadioGroup className="grid gap-3">
                            {["Medical Tourism", "Wellness Tourism", "Education & Training Tourism", "Sports Tourism"].map((type) => (
                              <div key={type} className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem
                                  id={type}
                                  name="tourismType"
                                  value={type}
                                  checked={formData.tourismType === type}
                                  onChange={handleChange}
                                  required
                                />
                                <Label htmlFor={type} className="cursor-pointer flex-1">
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="specificActivities">Specific Activities or Programs</Label>
                          <Textarea
                            id="specificActivities"
                            name="specificActivities"
                            value={formData.specificActivities}
                            onChange={handleChange}
                            placeholder="e.g., Cosmetic Surgery, Yoga Retreat, Language Course, Cricket Training, etc."
                            rows={3}
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Back
                          </Button>
                          <Button type="button" onClick={nextStep}>
                            Continue
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label>Budget Preferences *</Label>
                          <RadioGroup className="grid gap-3">
                            {["Basic (Economical)", "Mid-Level (Comfortable)", "Luxury (Premium)"].map((budget) => (
                              <div key={budget} className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem
                                  id={budget}
                                  name="budget"
                                  value={budget}
                                  checked={formData.budget === budget}
                                  onChange={handleChange}
                                  required
                                />
                                <Label htmlFor={budget} className="cursor-pointer flex-1">
                                  {budget}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <Label>Experience Level *</Label>
                          <RadioGroup className="grid gap-3">
                            {[
                              { value: "Authentic Experience", label: "Authentic Experience (Local transport, local cuisine)" },
                              { value: "Comfortable Experience", label: "Comfortable Experience (Mix of local and modern comforts)" },
                              { value: "Luxury Experience", label: "Luxury Experience (High-end accommodations, premium services)" }
                            ].map((exp) => (
                              <div key={exp.value} className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem
                                  id={exp.value}
                                  name="experienceLevel"
                                  value={exp.value}
                                  checked={formData.experienceLevel === exp.value}
                                  onChange={handleChange}
                                  required
                                />
                                <Label htmlFor={exp.value} className="cursor-pointer flex-1 text-sm">
                                  {exp.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additionalInfo">Additional Requirements or Preferences</Label>
                          <Textarea
                            id="additionalInfo"
                            name="additionalInfo"
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Any specific requirements or preferences you'd like us to know about..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="travelDates">Preferred Travel Dates</Label>
                          <Input
                            id="travelDates"
                            name="travelDates"
                            value={formData.travelDates}
                            onChange={handleChange}
                            placeholder="e.g., Jan 10-20, 2026 or Early Summer 2026"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label>How did you hear about us?</Label>
                          <RadioGroup className="grid gap-3 sm:grid-cols-2">
                            {["Website", "Social Media", "Friend/Family", "Other"].map((source) => (
                              <div key={source} className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-accent">
                                <RadioGroupItem
                                  id={source}
                                  name="referralSource"
                                  value={source}
                                  checked={formData.referralSource === source}
                                  onChange={handleChange}
                                />
                                <Label htmlFor={source} className="cursor-pointer flex-1">
                                  {source}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {formData.referralSource === "Other" && (
                          <div className="space-y-2">
                            <Label htmlFor="otherReferral">Please specify:</Label>
                            <Input
                              id="otherReferral"
                              name="otherReferral"
                              value={formData.otherReferral}
                              onChange={handleChange}
                            />
                          </div>
                        )}

                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            Back
                          </Button>
                          <Button type="submit">
                            <Send className="mr-2 h-4 w-4" />
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    )}
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

// Helper function (add to imports at the top)
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default ContactNew;

