import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Heart, Lightbulb, Trophy, Users, Target, Sparkles } from 'lucide-react';

const AboutNew: React.FC = () => {
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Integrity",
      description: "We build trust through transparency and honesty."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Care",
      description: "Our guests' comfort, safety, and satisfaction come first."
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Excellence",
      description: "We partner only with accredited institutions and professionals."
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation",
      description: "We constantly create new cross-border tourism concepts."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Empowerment",
      description: "We believe travel and learning can transform lives."
    }
  ];

  return (
    <section id="about" className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <Badge variant="outline" className="mb-4">About Us</Badge>
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Delivering Infinite Value Through Tourism
        </h2>
        <p className="text-lg text-muted-foreground">
          Founded by passionate professionals with over a decade of experience in hospitality and tourism
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center mb-16">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Centillion Gateway Pvt Ltd</span> is a Sri Lanka–based tourism company that specialises in medical, wellness, education, and sports tourism, connecting travellers and students with life-changing experiences across Sri Lanka, India, and Thailand.
            </p>
            
            <p className="text-lg leading-relaxed text-muted-foreground">
              Founded by two passionate professionals with over a decade of experience in the hospitality and tourism industry, Centillion was born from a simple yet powerful idea — to create international travel programs that offer infinite value and unforgettable experiences, while remaining affordable to everyone.
            </p>
            
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Why "Centillion"?</h3>
              <p className="text-muted-foreground">
                The name <span className="font-semibold text-primary">Centillion</span>, inspired by one of the world's largest numerical values, reflects the company's belief that while the cost of each package is small, the experience delivered is as grand as a Centillion.
              </p>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl border bg-muted shadow-xl">
              <img 
                src={require('../../assets/placeholder.jpeg')} 
                alt="Centillion Gateway" 
                className="h-full w-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-24 w-24 rounded-full bg-primary/20 blur-3xl"></div>
            <div className="absolute -top-4 -left-4 -z-10 h-32 w-32 rounded-full bg-secondary/20 blur-3xl"></div>
          </div>
        </div>
        
        {/* Vision & Mission */}
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          <Card className="border-primary/50">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To position Sri Lanka as a leading regional hub for medical, wellness, educational, and sports tourism, by connecting people with trusted institutions and world-class experiences across Asia.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/50">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To offer affordable, reliable, and enriching travel programs that combine care, knowledge, and culture — enabling our clients to improve their health, skills, and overall well-being through seamless, guided journeys.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Core Values */}
        <div>
          <h3 className="mb-8 text-center text-2xl font-bold">Our Core Values</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <Card key={index} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutNew;

