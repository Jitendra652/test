import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import PayPalButton from '@/components/PayPalButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Check,
  Crown,
  CreditCard,
  Calendar,
  Clock,
  DollarSign,
  Shield,
  Zap,
  Users,
  Star,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for casual adventurers',
    features: [
      '1GB file storage',
      '1,000 API calls/month',
      'Basic event discovery',
      '2 device sync',
      'Community support',
    ],
    limitations: [
      'Limited storage',
      'Basic features only',
      'No priority support',
    ],
    popular: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    description: 'Great for regular outdoor enthusiasts',
    features: [
      '5GB file storage',
      '5,000 API calls/month',
      'Advanced analytics',
      'Unlimited device sync',
      'Priority event notifications',
      'Email support',
    ],
    limitations: [],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 20,
    description: 'For serious adventure seekers',
    features: [
      '10GB file storage',
      '10,000 API calls/month',
      'Priority support',
      'Custom event creation',
      'Advanced budget tracking',
      'Exclusive group discounts',
      'Phone support',
      'API access',
    ],
    limitations: [],
    popular: false,
  },
];

export default function Payments() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayPal, setShowPayPal] = useState(false);

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/v1/user/payments'],
    queryFn: () => api.user.getPayments(),
  });

  const createPaymentMutation = useMutation({
    mutationFn: (data: { plan: string; amount: number; currency: string }) =>
      api.user.createPayment(data),
    onSuccess: () => {
      setShowPayPal(true);
      toast({
        title: 'Payment initiated',
        description: 'Please complete your payment with PayPal.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: error.message || 'Failed to initiate payment.',
      });
    },
  });

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      toast({
        title: 'Free plan',
        description: 'You are already on the free plan.',
      });
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setSelectedPlan(planId);
    createPaymentMutation.mutate({
      plan: planId,
      amount: plan.price,
      currency: 'USD',
    });
  };

  const handlePayPalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/v1/user/payments'] });
    queryClient.invalidateQueries({ queryKey: ['/api/v1/user/profile'] });
    setShowPayPal(false);
    setSelectedPlan(null);
    
    toast({
      title: 'Payment successful!',
      description: 'Your subscription has been upgraded successfully.',
    });
    
    navigate('/dashboard');
  };

  const currentPlan = plans.find(p => p.id === user?.plan) || plans[0];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="payments-page">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Adventure Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock more features and sync across unlimited devices
          </p>
        </div>

        <Tabs defaultValue="plans" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="plans" data-testid="tab-plans">Plans</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-8">
            {/* Current Plan */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Current Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {currentPlan.id === 'premium' && <Crown className="w-6 h-6 text-primary" />}
                      {currentPlan.id === 'basic' && <Star className="w-6 h-6 text-primary" />}
                      {currentPlan.id === 'free' && <Users className="w-6 h-6 text-primary" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold" data-testid="text-current-plan">
                        {currentPlan.name} Plan
                      </h3>
                      <p className="text-muted-foreground">{currentPlan.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${currentPlan.price}<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    {currentPlan.id !== 'free' && (
                      <div className="text-sm text-muted-foreground">
                        Next billing: Jan 15, 2025
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Plans */}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'border-2 border-primary' : ''} ${
                    user?.plan === plan.id ? 'opacity-60' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="text-center">
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <CardDescription className="mb-4">{plan.description}</CardDescription>
                      <div className="text-4xl font-bold">
                        ${plan.price}
                        <span className="text-lg font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <div className="space-y-2">
                        <Separator />
                        <div className="text-xs text-muted-foreground">Limitations:</div>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <AlertCircle className="w-3 h-3" />
                              <span>{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      variant={plan.id === user?.plan ? 'secondary' : plan.popular ? 'default' : 'outline'}
                      disabled={plan.id === user?.plan || createPaymentMutation.isPending}
                      onClick={() => handlePlanSelect(plan.id)}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {plan.id === user?.plan ? (
                        'Current Plan'
                      ) : plan.id === 'free' ? (
                        'Downgrade to Free'
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* PayPal Integration */}
            {showPayPal && selectedPlan && (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Complete Your Payment</CardTitle>
                  <CardDescription>
                    Secure payment powered by PayPal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Plan:</span>
                    <span className="font-semibold">{plans.find(p => p.id === selectedPlan)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Amount:</span>
                    <span className="font-semibold">${plans.find(p => p.id === selectedPlan)?.price}/month</span>
                  </div>
                  <Separator />
                  <div className="flex justify-center">
                    <PayPalButton
                      amount={plans.find(p => p.id === selectedPlan)?.price.toString() || '0'}
                      currency="USD"
                      intent="subscription"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowPayPal(false);
                      setSelectedPlan(null);
                    }}
                    data-testid="button-cancel-payment"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* PayPal Security Notice */}
            <div className="text-center mt-8 p-6 bg-card rounded-lg border">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-semibold">PayPal</span>
                <span>Secure payments powered by PayPal</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment History</span>
                </CardTitle>
                <CardDescription>
                  View your past transactions and billing history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading payment history...</p>
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment: any) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`payment-${payment.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {payment.status === 'completed' ? (
                              <Check className="w-5 h-5 text-green-500" />
                            ) : payment.status === 'pending' ? (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium" data-testid={`text-payment-plan-${payment.id}`}>
                              {payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)} Plan
                            </div>
                            <div className="text-sm text-muted-foreground" data-testid={`text-payment-date-${payment.id}`}>
                              {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold" data-testid={`text-payment-amount-${payment.id}`}>
                            ${payment.amount}
                          </div>
                          <Badge
                            variant={
                              payment.status === 'completed' ? 'default' :
                              payment.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            data-testid={`badge-payment-status-${payment.id}`}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No payment history yet</p>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to a paid plan to see your payment history here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
