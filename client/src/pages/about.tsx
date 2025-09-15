import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Mountain,
  Users,
  Globe,
  Heart,
  Target,
  Award,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Events Hosted', value: '15,000+', icon: Calendar },
    { label: 'Countries', value: '25+', icon: Globe },
    { label: 'Money Saved', value: '$2M+', icon: DollarSign },
  ];

  const values = [
    {
      icon: Mountain,
      title: 'Adventure First',
      description: 'We believe everyone deserves access to amazing outdoor experiences, regardless of budget.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Our platform thrives on the connections and shared experiences of outdoor enthusiasts.',
    },
    {
      icon: Heart,
      title: 'Inclusive & Accessible',
      description: 'We welcome adventurers of all skill levels and backgrounds to join our community.',
    },
    {
      icon: Target,
      title: 'Budget Conscious',
      description: 'We help you discover incredible adventures without breaking the bank.',
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former Google PM with 10+ years in outdoor recreation. Passionate about making adventures accessible.',
      image: '👩‍💼',
    },
    {
      name: 'Mike Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Spotify engineer and avid climber. Builds technology that connects people with nature.',
      image: '👨‍💻',
    },
    {
      name: 'Alex Thompson',
      role: 'Head of Community',
      bio: 'Adventure photographer and community builder. Organizes events across 15+ cities.',
      image: '👨‍🎨',
    },
    {
      name: 'Jamie Park',
      role: 'Product Designer',
      bio: 'UX designer and weekend warrior. Creates beautiful, intuitive experiences for adventurers.',
      image: '👩‍🎨',
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            About Adventure Sync
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            We're on a mission to make outdoor adventures accessible, affordable, and unforgettable for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              Breaking down barriers to outdoor adventure
            </p>
          </div>
          
          <Card className="p-8">
            <CardContent className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold">Democratizing Outdoor Adventures</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe that financial constraints shouldn't prevent anyone from experiencing the joy, 
                health benefits, and personal growth that come from outdoor adventures. Adventure Sync 
                connects budget-conscious adventurers with affordable activities, group discounts, and 
                free events in their area.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                By leveraging technology and community, we're making it easier than ever to discover, 
                plan, and share amazing outdoor experiences while staying within your budget.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">
              Numbers that tell our story
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              What drives us every day
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3" data-testid={`value-title-${index}`}>
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground" data-testid={`value-description-${index}`}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              The adventurers behind Adventure Sync
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{member.image}</div>
                  <h3 className="font-semibold text-lg mb-1" data-testid={`team-name-${index}`}>
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm mb-3" data-testid={`team-role-${index}`}>
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm" data-testid={`team-bio-${index}`}>
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground">
              How Adventure Sync came to life
            </p>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">The Beginning (2022)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Adventure Sync started when our founders Sarah and Mike realized they were missing out on 
                      amazing outdoor activities simply because they couldn't afford the high prices or didn't 
                      know about free alternatives. They began organizing budget-friendly group adventures for 
                      friends and quickly realized there was a huge demand for affordable outdoor experiences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Growing the Community (2023)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      What started as a small group of friends grew into a community of thousands. We launched 
                      our first mobile app, partnered with local outdoor gear shops for group discounts, and 
                      began organizing events in 10 major cities. Our users saved over $500,000 in their first 
                      year using the platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Going Global (2024)</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Today, Adventure Sync operates in 25+ countries, has facilitated over 15,000 events, 
                      and helped our community save millions of dollars on outdoor adventures. We've expanded 
                      beyond just event discovery to include budget tracking, gear sharing, and real-time 
                      coordination across devices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Adventure</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Ready to discover amazing outdoor experiences without breaking the bank? 
            Join thousands of adventurers who are already exploring more for less.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild data-testid="button-get-started">
              <Link href="/register">Get Started Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-learn-more">
              <Link href="/contact" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
