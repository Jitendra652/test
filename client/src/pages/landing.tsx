import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { EventCard } from '@/components/EventCard';
import { ActivityCategory } from '@/components/ActivityCategory';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Search, MapPin, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';

export default function Landing() {
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/v1/events'],
    queryFn: () => api.events.getAll(),
  });

  const { data: userProfile } = useQuery({
    queryKey: ['/api/v1/user/profile'],
    queryFn: () => api.user.getProfile(),
    enabled: isAuthenticated,
  });

  const { data: budget } = useQuery({
    queryKey: ['/api/v1/budget'],
    queryFn: () => api.budget.get(),
    enabled: isAuthenticated,
  });

  const activityCategories = [
    { name: 'Hiking', icon: 'hiking', eventCount: 250, color: 'bg-primary' },
    { name: 'Water Sports', icon: 'water', eventCount: 180, color: 'bg-blue-500' },
    { name: 'Cycling', icon: 'cycling', eventCount: 320, color: 'bg-orange-500' },
    { name: 'Camping', icon: 'camping', eventCount: 150, color: 'bg-purple-500' },
    { name: 'Climbing', icon: 'climbing', eventCount: 95, color: 'bg-red-500' },
    { name: 'Photography', icon: 'photography', eventCount: 130, color: 'bg-green-500' },
  ];

  const featuredEvents = events?.slice(0, 3) || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/events?${params.toString()}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/events?category=${category}`);
  };

  const budgetPercentage = budget 
    ? (parseFloat(budget.activitiesSpent) + parseFloat(budget.equipmentSpent) + parseFloat(budget.transportSpent)) / parseFloat(budget.monthlyBudget) * 100
    : 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden" data-testid="hero-section">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in" data-testid="text-hero-title">
            Discover Your Next<br />
            <span className="text-yellow-300">Adventure</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 animate-fade-in" data-testid="text-hero-subtitle">
            Find budget-friendly outdoor activities and events near you. Sync across all your devices and never miss an adventure.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-2 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search activities, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/70 border-none focus:ring-2 focus:ring-white/50 rounded-xl"
                  data-testid="input-search"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full md:w-48 pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/70 border-none focus:ring-2 focus:ring-white/50 rounded-xl"
                  data-testid="input-location"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-semibold"
                data-testid="button-search"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 mt-12 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-yellow-300" />
              <span data-testid="text-stat-locations">2,450+ locations</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-300" />
              <span data-testid="text-stat-events">15,000+ events</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-yellow-300" />
              <span>Budget-friendly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Categories */}
      <section className="py-16 px-4 bg-muted/50" data-testid="activity-categories">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Popular Activities</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from thousands of outdoor adventures perfect for your budget and skill level
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activityCategories.map((category) => (
              <ActivityCategory
                key={category.name}
                category={category}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4" data-testid="featured-events">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">Featured Events</h3>
              <p className="text-muted-foreground text-lg">Don't miss these amazing upcoming adventures</p>
            </div>
            <Button 
              variant="outline" 
              asChild 
              className="hidden md:block"
              data-testid="button-view-all-events"
            >
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
          
          {eventsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded mb-3"></div>
                    <div className="h-16 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event: any) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8 md:hidden">
            <Button asChild data-testid="button-view-all-events-mobile">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Budget Tracker (for authenticated users) */}
      {isAuthenticated && (
        <section className="py-16 px-4 bg-muted/50" data-testid="budget-tracker">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">Stay On Budget</h3>
                <p className="text-muted-foreground text-lg">Track your adventure spending and discover money-saving opportunities</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Budget Overview */}
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-semibold">Monthly Budget</h4>
                      <Button variant="ghost" size="sm" data-testid="button-edit-budget">
                        Edit
                      </Button>
                    </div>
                    
                    {budget ? (
                      <>
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-muted-foreground mb-2">
                            <span>Spent: <span className="font-semibold text-foreground" data-testid="text-budget-spent">
                              ${(parseFloat(budget.activitiesSpent) + parseFloat(budget.equipmentSpent) + parseFloat(budget.transportSpent)).toFixed(2)}
                            </span></span>
                            <span>Budget: <span className="font-semibold text-foreground" data-testid="text-budget-total">
                              ${budget.monthlyBudget}
                            </span></span>
                          </div>
                          <Progress value={budgetPercentage} className="h-3" />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <span className="text-sm">Activities & Events</span>
                            </div>
                            <span className="text-sm font-semibold" data-testid="text-activities-spent">
                              ${budget.activitiesSpent}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-accent rounded-full"></div>
                              <span className="text-sm">Equipment Rental</span>
                            </div>
                            <span className="text-sm font-semibold" data-testid="text-equipment-spent">
                              ${budget.equipmentSpent}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">Transportation</span>
                            </div>
                            <span className="text-sm font-semibold" data-testid="text-transport-spent">
                              ${budget.transportSpent}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Set up your monthly budget to start tracking expenses</p>
                        <Button data-testid="button-setup-budget">Set Up Budget</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Savings & Tips */}
                <Card>
                  <CardContent className="p-8">
                    <h4 className="text-xl font-semibold mb-6">Money-Saving Tips</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <DollarSign className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Free Events Nearby</h5>
                          <p className="text-xs text-muted-foreground mt-1">5 free hiking meetups this weekend</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Group Discounts</h5>
                          <p className="text-xs text-muted-foreground mt-1">Save 20% on group bookings of 4+</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm">Off-Peak Pricing</h5>
                          <p className="text-xs text-muted-foreground mt-1">Weekday activities up to 40% off</p>
                        </div>
                      </div>
                    </div>
                    
                    {userProfile?.stats && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary" data-testid="text-total-saved">
                            ${userProfile.stats.totalSaved}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Saved This Month</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* User Dashboard Preview (for authenticated users) */}
      {isAuthenticated && userProfile && (
        <section className="py-16 px-4" data-testid="dashboard-preview">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-foreground mb-4">Your Adventure Dashboard</h3>
                <p className="text-muted-foreground text-lg">Track your activities, manage subscriptions, and sync across devices</p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile & Stats */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-semibold">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold" data-testid="text-user-name">{user?.name}</h4>
                            <p className="text-muted-foreground" data-testid="text-user-location">{user?.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Current Plan</div>
                          <Badge variant="secondary" data-testid="text-user-plan">{user?.plan}</Badge>
                        </div>
                      </div>
                      
                      {/* Activity Stats */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="text-center">
                          <div className="text-3xl font-bold" data-testid="text-events-joined">
                            {userProfile.stats.eventsJoined}
                          </div>
                          <div className="text-sm text-muted-foreground">Events Joined</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold" data-testid="text-miles-explored">
                            {userProfile.stats.milesExplored}
                          </div>
                          <div className="text-sm text-muted-foreground">Miles Explored</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold" data-testid="text-total-saved">
                            ${userProfile.stats.totalSaved}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Saved</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button asChild data-testid="button-view-dashboard">
                          <Link href="/dashboard">View Full Dashboard</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Quick Actions */}
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h5 className="text-lg font-semibold mb-4">Quick Actions</h5>
                      <div className="space-y-3">
                        <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-upload-files">
                          <Link href="/files">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Upload Files
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-view-analytics">
                          <Link href="/analytics">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            View Analytics
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-upgrade-plan">
                          <Link href="/payments">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Upgrade Plan
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pricing Plans */}
      <section className="py-16 px-4 bg-muted/50" data-testid="pricing-plans">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">Choose Your Adventure Plan</h3>
              <p className="text-muted-foreground text-lg">Unlock more features and sync across unlimited devices</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <Card className="relative">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-bold mb-2">Free</h4>
                    <div className="text-3xl font-bold">$0<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">1GB file storage</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">1,000 API calls/month</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Basic event discovery</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">2 device sync</span>
                    </li>
                  </ul>
                  
                  <Button variant="secondary" className="w-full" disabled data-testid="button-current-plan">
                    Current Plan
                  </Button>
                </CardContent>
              </Card>
              
              {/* Basic Plan */}
              <Card className="relative border-2 border-primary">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
                
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-bold mb-2">Basic</h4>
                    <div className="text-3xl font-bold">$10<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">5GB file storage</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">5,000 API calls/month</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Unlimited device sync</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Priority event notifications</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full" asChild data-testid="button-upgrade-basic">
                    <Link href="/payments?plan=basic">Upgrade to Basic</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Premium Plan */}
              <Card className="relative">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h4 className="text-xl font-bold mb-2">Premium</h4>
                    <div className="text-3xl font-bold">$20<span className="text-lg text-muted-foreground font-normal">/month</span></div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">10GB file storage</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">10,000 API calls/month</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Custom event creation</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Advanced budget tracking</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      <span className="text-sm">Exclusive group discounts</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" className="w-full" asChild data-testid="button-upgrade-premium">
                    <Link href="/payments?plan=premium">Upgrade to Premium</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* PayPal Integration Notice */}
            <div className="text-center mt-8 p-6 bg-card rounded-lg border">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span className="text-blue-600 font-semibold">PayPal</span>
                <span>Secure payments powered by PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
