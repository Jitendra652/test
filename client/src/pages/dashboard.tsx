import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';
import {
  User,
  MapPin,
  Calendar,
  TrendingUp,
  Upload,
  BarChart3,
  CreditCard,
  Settings,
  Smartphone,
  RotateCcw,
  Mountain,
  Bike,
  Plus,
  HardDrive,
  Zap,
  Crown,
} from 'lucide-react';

export default function Dashboard() {
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

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/v1/metrics'],
    queryFn: () => api.metrics.get(),
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
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

  const budgetPercentage = budget 
    ? (parseFloat(budget.activitiesSpent) + parseFloat(budget.equipmentSpent) + parseFloat(budget.transportSpent)) / parseFloat(budget.monthlyBudget) * 100
    : 0;

  const storagePercentage = user ? (stats.storageUsed / (user.plan === 'free' ? 1073741824 : user.plan === 'basic' ? 5368709120 : 10737418240)) * 100 : 0;
  const apiCallsPercentage = user ? (stats.apiCallsUsed / (user.plan === 'free' ? 1000 : user.plan === 'basic' ? 5000 : 10000)) * 100 : 0;

  const recentActivities = [
    {
      id: '1',
      title: 'Mountain Trail Hike',
      type: 'hiking',
      date: '2 days ago',
      distance: '5.2 mi',
      icon: Mountain,
    },
    {
      id: '2',
      title: 'City Bike Tour',
      type: 'cycling',
      date: '5 days ago',
      distance: '12.8 mi',
      icon: Bike,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="dashboard-page">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-welcome">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your adventure journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold" data-testid="text-user-name">{user?.name}</h3>
                      <p className="text-muted-foreground flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span data-testid="text-user-location">{user?.location || 'Location not set'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Current Plan</div>
                    <Badge variant={user?.plan === 'free' ? 'secondary' : 'default'} className="capitalize" data-testid="badge-user-plan">
                      {user?.plan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                      {user?.plan}
                    </Badge>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground" data-testid="text-events-joined">
                      {stats.eventsJoined}
                    </div>
                    <div className="text-sm text-muted-foreground">Events Joined</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground" data-testid="text-miles-explored">
                      {stats.milesExplored}
                    </div>
                    <div className="text-sm text-muted-foreground">Miles Explored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary" data-testid="text-total-saved">
                      ${stats.totalSaved}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Saved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Usage Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Storage Usage */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Storage Used</span>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid="text-storage-usage">
                      {(stats.storageUsed / 1024 / 1024).toFixed(1)} MB / {user?.plan === 'free' ? '1' : user?.plan === 'basic' ? '5' : '10'} GB
                    </span>
                  </div>
                  <Progress value={storagePercentage} className="h-2" />
                </div>

                {/* API Calls */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">API Calls This Month</span>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid="text-api-usage">
                      {stats.apiCallsUsed.toLocaleString()} / {user?.plan === 'free' ? '1,000' : user?.plan === 'basic' ? '5,000' : '10,000'}
                    </span>
                  </div>
                  <Progress value={apiCallsPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <activity.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground" data-testid={`text-activity-title-${activity.id}`}>
                            {activity.title}
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid={`text-activity-date-${activity.id}`}>
                            Completed {activity.date}
                          </div>
                        </div>
                        <div className="text-primary font-semibold" data-testid={`text-activity-distance-${activity.id}`}>
                          {activity.distance}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No recent activities</p>
                    <Button asChild data-testid="button-browse-events">
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Overview */}
            {budget && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Monthly Budget</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-foreground" data-testid="text-activities-spent">
                        ${budget.activitiesSpent}
                      </div>
                      <div className="text-xs text-muted-foreground">Activities</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground" data-testid="text-equipment-spent">
                        ${budget.equipmentSpent}
                      </div>
                      <div className="text-xs text-muted-foreground">Equipment</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-foreground" data-testid="text-transport-spent">
                        ${budget.transportSpent}
                      </div>
                      <div className="text-xs text-muted-foreground">Transport</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Plan</span>
                  <Badge variant={user?.plan === 'free' ? 'secondary' : 'default'} className="capitalize">
                    {user?.plan}
                  </Badge>
                </div>
                {user?.plan !== 'free' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Cost</span>
                      <span className="font-semibold">${user?.plan === 'basic' ? '10' : '20'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Next Billing</span>
                      <span className="font-semibold">Jan 15, 2025</span>
                    </div>
                  </>
                )}
                <Button 
                  className="w-full" 
                  variant={user?.plan === 'free' ? 'default' : 'outline'}
                  asChild
                  data-testid="button-manage-subscription"
                >
                  <Link href="/payments">
                    {user?.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Device Sync */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Sync</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">iPhone 15 Pro</div>
                    <div className="text-xs text-muted-foreground">Last synced: 2 min ago</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">MacBook Pro</div>
                    <div className="text-xs text-muted-foreground">Last synced: 1 hour ago</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-xs text-muted-foreground text-center">
                    <RotateCcw className="w-4 h-4 inline mr-1" />
                    All devices synced
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-create-event">
                  <Link href="/events">
                    <Plus className="w-4 h-4 mr-3" />
                    Create Event
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-upload-files">
                  <Link href="/files">
                    <Upload className="w-4 h-4 mr-3" />
                    Upload Files
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-view-analytics">
                  <Link href="/analytics">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    View Analytics
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild data-testid="button-settings">
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
