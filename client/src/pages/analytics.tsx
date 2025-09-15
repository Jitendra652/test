import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  Target,
  Award,
  Activity,
  Download,
  Share2,
} from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/v1/user/profile'],
    queryFn: () => api.user.getProfile(),
  });

  const { data: budget, isLoading: budgetLoading } = useQuery({
    queryKey: ['/api/v1/budget'],
    queryFn: () => api.budget.get(),
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/v1/user/payments'],
    queryFn: () => api.user.getPayments(),
  });

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ['/api/v1/files'],
    queryFn: () => api.files.getAll(),
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = userProfile?.stats || {
    eventsJoined: 0,
    milesExplored: 0,
    totalSaved: 0,
    apiCallsUsed: 0,
    storageUsed: 0,
  };

  // Calculate analytics data
  const monthlyActivity = [
    { month: 'Jan', events: 2, miles: 12, savings: 25 },
    { month: 'Feb', events: 4, miles: 28, savings: 45 },
    { month: 'Mar', events: 3, miles: 22, savings: 35 },
    { month: 'Apr', events: 5, miles: 35, savings: 55 },
    { month: 'May', events: 6, miles: 42, savings: 67 },
    { month: 'Jun', events: 4, miles: 31, savings: 48 },
  ];

  const activityTypes = [
    { type: 'Hiking', count: 12, percentage: 40 },
    { type: 'Cycling', count: 8, percentage: 27 },
    { type: 'Water Sports', count: 5, percentage: 17 },
    { type: 'Climbing', count: 3, percentage: 10 },
    { type: 'Photography', count: 2, percentage: 6 },
  ];

  const achievements = [
    { id: 1, title: 'Early Adopter', description: 'Joined Adventure Sync in the first month', earned: true, date: '2024-01-15' },
    { id: 2, title: 'Budget Master', description: 'Stayed under budget for 3 consecutive months', earned: true, date: '2024-03-31' },
    { id: 3, title: 'Social Butterfly', description: 'Joined 10+ group events', earned: true, date: '2024-05-20' },
    { id: 4, title: 'Explorer', description: 'Visited 5 different states for adventures', earned: false, progress: 3 },
    { id: 5, title: 'Century Club', description: 'Complete 100 miles of activities', earned: false, progress: 156 },
    { id: 6, title: 'Savings Champion', description: 'Save $500 on adventures', earned: false, progress: 127 },
  ];

  const storagePercentage = user ? (stats.storageUsed / (user.plan === 'free' ? 1073741824 : user.plan === 'basic' ? 5368709120 : 10737418240)) * 100 : 0;
  const apiCallsPercentage = user ? (stats.apiCallsUsed / (user.plan === 'free' ? 1000 : user.plan === 'basic' ? 5000 : 10000)) * 100 : 0;

  return (
    <div className="min-h-screen bg-background py-8" data-testid="analytics-page">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Insights into your adventure journey and platform usage
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" data-testid="button-export-data">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" data-testid="button-share-stats">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="activities" data-testid="tab-activities">Activities</TabsTrigger>
            <TabsTrigger value="budget" data-testid="tab-budget">Budget</TabsTrigger>
            <TabsTrigger value="usage" data-testid="tab-usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Events Joined</p>
                      <p className="text-2xl font-bold" data-testid="metric-events-joined">
                        {stats.eventsJoined}
                      </p>
                      <p className="text-xs text-green-600">+2 this month</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Miles Explored</p>
                      <p className="text-2xl font-bold" data-testid="metric-miles-explored">
                        {stats.milesExplored}
                      </p>
                      <p className="text-xs text-green-600">+12 this month</p>
                    </div>
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Saved</p>
                      <p className="text-2xl font-bold" data-testid="metric-total-saved">
                        ${stats.totalSaved}
                      </p>
                      <p className="text-xs text-green-600">+$23 this month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg per Event</p>
                      <p className="text-2xl font-bold" data-testid="metric-avg-per-event">
                        ${stats.eventsJoined > 0 ? (stats.totalSaved / stats.eventsJoined).toFixed(0) : '0'}
                      </p>
                      <p className="text-xs text-green-600">savings</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>6-Month Activity Trend</span>
                </CardTitle>
                <CardDescription>Your adventure activity over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyActivity.map((month, index) => (
                    <div key={month.month} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium" data-testid={`month-${index}`}>{month.month}</span>
                        <span className="text-muted-foreground">
                          {month.events} events • {month.miles} miles • ${month.savings} saved
                        </span>
                      </div>
                      <Progress value={(month.events / 6) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
                <CardDescription>Your adventure milestones and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 border rounded-lg ${achievement.earned ? 'bg-primary/5 border-primary/20' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            achievement.earned ? 'bg-primary/20' : 'bg-muted'
                          }`}>
                            <Award className={`w-5 h-5 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground" data-testid={`achievement-title-${achievement.id}`}>
                              {achievement.title}
                            </h4>
                            <p className="text-sm text-muted-foreground" data-testid={`achievement-description-${achievement.id}`}>
                              {achievement.description}
                            </p>
                            {achievement.earned ? (
                              <p className="text-xs text-primary mt-1" data-testid={`achievement-date-${achievement.id}`}>
                                Earned {achievement.date}
                              </p>
                            ) : (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.progress}/{achievement.id === 4 ? '5' : achievement.id === 5 ? '100' : '500'}</span>
                                </div>
                                <Progress
                                  value={
                                    achievement.id === 4 ? (achievement.progress! / 5) * 100 :
                                    achievement.id === 5 ? (achievement.progress! / 100) * 100 :
                                    (achievement.progress! / 500) * 100
                                  }
                                  className="h-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant={achievement.earned ? 'default' : 'secondary'}>
                          {achievement.earned ? 'Earned' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {/* Activity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
                <CardDescription>Types of adventures you enjoy most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityTypes.map((activity, index) => (
                    <div key={activity.type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium" data-testid={`activity-type-${index}`}>{activity.type}</span>
                        <span className="text-muted-foreground">
                          {activity.count} events ({activity.percentage}%)
                        </span>
                      </div>
                      <Progress value={activity.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Location Analysis</CardTitle>
                <CardDescription>Where your adventures take place</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Location Insights</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed location analytics will be available with more activity data
                  </p>
                  <Button variant="outline" data-testid="button-view-map">
                    View Activity Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            {budget ? (
              <>
                {/* Budget Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Analysis</CardTitle>
                    <CardDescription>How you're managing your adventure budget</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold" data-testid="budget-monthly">
                          ${budget.monthlyBudget}
                        </div>
                        <div className="text-sm text-muted-foreground">Monthly Budget</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold" data-testid="budget-spent">
                          ${(parseFloat(budget.activitiesSpent) + parseFloat(budget.equipmentSpent) + parseFloat(budget.transportSpent)).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Spent</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold" data-testid="budget-remaining">
                          ${(parseFloat(budget.monthlyBudget) - (parseFloat(budget.activitiesSpent) + parseFloat(budget.equipmentSpent) + parseFloat(budget.transportSpent))).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Remaining</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Spending Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Where your adventure budget goes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Activities & Events</span>
                          <span>${budget.activitiesSpent}</span>
                        </div>
                        <Progress value={(parseFloat(budget.activitiesSpent) / parseFloat(budget.monthlyBudget)) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Equipment Rental</span>
                          <span>${budget.equipmentSpent}</span>
                        </div>
                        <Progress value={(parseFloat(budget.equipmentSpent) / parseFloat(budget.monthlyBudget)) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Transportation</span>
                          <span>${budget.transportSpent}</span>
                        </div>
                        <Progress value={(parseFloat(budget.transportSpent) / parseFloat(budget.monthlyBudget)) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Budget Set</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up a monthly budget to track your adventure spending
                  </p>
                  <Button data-testid="button-setup-budget">Set Up Budget</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            {/* Platform Usage */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Storage Usage</CardTitle>
                  <CardDescription>File storage across your plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Used Storage</span>
                      <span>{(stats.storageUsed / 1024 / 1024).toFixed(1)} MB / {
                        user?.plan === 'free' ? '1 GB' : 
                        user?.plan === 'basic' ? '5 GB' : '10 GB'
                      }</span>
                    </div>
                    <Progress value={storagePercentage} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {storagePercentage < 80 ? 'You have plenty of storage remaining' : 
                       storagePercentage < 95 ? 'Consider upgrading your plan soon' : 
                       'Storage is almost full'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                  <CardDescription>API calls this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>API Calls Used</span>
                      <span>{stats.apiCallsUsed.toLocaleString()} / {
                        user?.plan === 'free' ? '1,000' : 
                        user?.plan === 'basic' ? '5,000' : '10,000'
                      }</span>
                    </div>
                    <Progress value={apiCallsPercentage} className="h-3" />
                    <p className="text-xs text-muted-foreground">
                      {apiCallsPercentage < 80 ? 'Your usage is well within limits' : 
                       apiCallsPercentage < 95 ? 'Approaching your monthly limit' : 
                       'Consider upgrading to avoid interruption'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Usage Timeline</span>
                </CardTitle>
                <CardDescription>Your platform activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Usage Timeline</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed usage analytics will be available with more activity data
                  </p>
                  <Button variant="outline" data-testid="button-detailed-usage">
                    View Detailed Usage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
