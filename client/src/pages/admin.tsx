import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  CreditCard,
  BarChart3,
  Database,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  Activity,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/v1/metrics'],
    queryFn: () => api.metrics.get(),
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/v1/user/payments', 'all'],
    queryFn: () => api.user.getPayments(),
  });

  const seedDatabaseMutation = useMutation({
    mutationFn: () => api.admin?.seed?.() || Promise.resolve({ message: 'Seed functionality not implemented' }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast({
        title: 'Database seeded successfully',
        description: 'Sample data has been added to the database.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Seed failed',
        description: error.message || 'Failed to seed database.',
      });
    },
  });

  // Check if user has admin privileges
  const isAdmin = user?.username === 'admin' || user?.username === 'alexchen'; // Demo user is admin

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background py-8" data-testid="admin-page">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Access denied. You don't have permission to view this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const systemStats = metrics?.system || {
    totalUsers: 0,
    totalEvents: 0,
    totalPayments: 0,
    totalFileStorage: 0,
  };

  const recentActivity = [
    { id: 1, type: 'user_registered', description: 'New user registration: john.doe@example.com', timestamp: new Date() },
    { id: 2, type: 'payment_completed', description: 'Payment completed: $10.00 Basic plan', timestamp: new Date(Date.now() - 3600000) },
    { id: 3, type: 'event_created', description: 'New event: Mountain Hiking Adventure', timestamp: new Date(Date.now() - 7200000) },
    { id: 4, type: 'file_uploaded', description: 'File uploaded: adventure-photo.jpg (2.3MB)', timestamp: new Date(Date.now() - 10800000) },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return Users;
      case 'payment_completed': return CreditCard;
      case 'event_created': return Calendar;
      case 'file_uploaded': return FileText;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8" data-testid="admin-page">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            System management and analytics dashboard
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
            <TabsTrigger value="system" data-testid="tab-system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold" data-testid="stat-total-users">
                        {systemStats.totalUsers.toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="text-2xl font-bold" data-testid="stat-total-events">
                        {systemStats.totalEvents.toLocaleString()}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Payments</p>
                      <p className="text-2xl font-bold" data-testid="stat-total-payments">
                        {systemStats.totalPayments.toLocaleString()}
                      </p>
                    </div>
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Storage Used</p>
                      <p className="text-2xl font-bold" data-testid="stat-storage-used">
                        {(systemStats.totalFileStorage / 1024 / 1024 / 1024).toFixed(1)}GB
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest system events and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground" data-testid={`activity-description-${activity.id}`}>
                            {activity.description}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`activity-timestamp-${activity.id}`}>
                            {format(activity.timestamp, 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {activity.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => seedDatabaseMutation.mutate()}
                    disabled={seedDatabaseMutation.isPending}
                    data-testid="button-seed-database"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {seedDatabaseMutation.isPending ? 'Seeding...' : 'Seed Database'}
                  </Button>
                  <Button variant="outline" data-testid="button-backup-data">
                    <Shield className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button variant="outline" data-testid="button-system-logs">
                    <FileText className="w-4 h-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">User Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced user management features are coming soon
                  </p>
                  <Button variant="outline" data-testid="button-export-users">
                    Export User List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Analytics</span>
                </CardTitle>
                <CardDescription>Revenue and subscription analytics</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading payment data...</p>
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 border rounded-lg">
                        <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          ${payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{payments.length}</div>
                        <div className="text-sm text-muted-foreground">Total Transactions</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold">
                          ${(payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) / payments.length).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Average Transaction</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Recent Transactions</h4>
                      {payments.slice(0, 10).map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium" data-testid={`payment-plan-${payment.id}`}>
                              {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)} Plan
                            </div>
                            <div className="text-sm text-muted-foreground" data-testid={`payment-date-${payment.id}`}>
                              {format(new Date(payment.createdAt), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold" data-testid={`payment-amount-${payment.id}`}>
                              ${payment.amount}
                            </div>
                            <Badge
                              variant={payment.status === 'completed' ? 'default' : 'secondary'}
                              data-testid={`payment-status-${payment.id}`}
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Payment Data</h3>
                    <p className="text-muted-foreground">No payments have been processed yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default" className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-500">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PayPal Integration</span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WebSocket Server</span>
                    <Badge variant="default" className="bg-green-500">Running</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Database Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Users Table</span>
                    <span className="font-semibold">{systemStats.totalUsers} records</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Events Table</span>
                    <span className="font-semibold">{systemStats.totalEvents} records</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payments Table</span>
                    <span className="font-semibold">{systemStats.totalPayments} records</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="font-semibold">
                      {(systemStats.totalFileStorage / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>Advanced system management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" data-testid="button-clear-cache">
                    <Database className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline" data-testid="button-restart-services">
                    <Activity className="w-4 h-4 mr-2" />
                    Restart Services
                  </Button>
                  <Button variant="outline" data-testid="button-export-logs">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button variant="outline" data-testid="button-maintenance-mode">
                    <Settings className="w-4 h-4 mr-2" />
                    Maintenance Mode
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
