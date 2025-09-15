import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileText, Shield, Users, CreditCard, AlertTriangle, Mail } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: [
        'By accessing and using Adventure Sync, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'These Terms of Service are effective as of January 1, 2024, and may be updated from time to time.',
      ],
    },
    {
      id: 'description',
      title: 'Service Description',
      icon: Users,
      content: [
        'Adventure Sync is a platform that connects outdoor enthusiasts with budget-friendly activities and events.',
        'We provide tools for discovering events, managing budgets, file sharing, and community interaction.',
        'Our services include both free and premium subscription tiers with varying features and limitations.',
      ],
    },
    {
      id: 'accounts',
      title: 'User Accounts',
      icon: Shield,
      content: [
        'You must provide accurate, current, and complete information during registration.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to accept responsibility for all activities that occur under your account.',
        'You must notify us immediately of any unauthorized use of your account.',
      ],
    },
    {
      id: 'conduct',
      title: 'Acceptable Use',
      icon: Users,
      content: [
        'You agree not to use the service for any unlawful purpose or in any way that violates these terms.',
        'You will not upload, post, or transmit any content that is harmful, threatening, abusive, or otherwise objectionable.',
        'You will not attempt to interfere with the proper working of the service or disrupt other users\' experience.',
        'You will not use automated systems to access the service without our express written permission.',
      ],
    },
    {
      id: 'payments',
      title: 'Payment Terms',
      icon: CreditCard,
      content: [
        'Subscription fees are billed in advance on a monthly basis and are non-refundable except as required by law.',
        'We use PayPal as our payment processor. By making a payment, you agree to PayPal\'s terms of service.',
        'We reserve the right to change our pricing at any time, with advance notice to existing subscribers.',
        'Failed payments may result in service suspension until payment is resolved.',
      ],
    },
    {
      id: 'content',
      title: 'Content and Intellectual Property',
      icon: FileText,
      content: [
        'You retain ownership of content you upload, but grant us a license to use it in connection with the service.',
        'You represent that you have the right to upload and share any content you post on the platform.',
        'We respect intellectual property rights and will respond to valid DMCA takedown notices.',
        'Our trademarks, service marks, and logos are our property and may not be used without permission.',
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy and Data',
      icon: Shield,
      content: [
        'We collect and process your personal information in accordance with our Privacy Policy.',
        'We implement appropriate security measures to protect your personal information.',
        'You can request access to, correction of, or deletion of your personal data at any time.',
        'We do not sell your personal information to third parties.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: [
        'Adventure Sync is provided "as is" without warranties of any kind, express or implied.',
        'We are not liable for any indirect, incidental, special, or consequential damages.',
        'Our total liability to you for any claims shall not exceed the amount you paid us in the past 12 months.',
        'You participate in outdoor activities at your own risk. We are not responsible for accidents or injuries.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="terms-page">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Last updated: January 1, 2024
          </p>
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Important Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    Please read these terms carefully before using Adventure Sync. By using our service, 
                    you agree to be bound by these terms. If you have any questions, please contact us.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`toc-link-${section.id}`}
                >
                  <section.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{section.title}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.id} id={section.id} className="scroll-mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <section.icon className="w-6 h-6 text-primary" />
                  <span>{index + 1}. {section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-muted-foreground leading-relaxed"
                      data-testid={`section-${section.id}-paragraph-${pIndex}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Questions About These Terms?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please don't hesitate to contact us. 
              We're here to help clarify any concerns you may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild data-testid="button-contact-us">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild data-testid="button-privacy-policy">
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
            <Separator className="my-6" />
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>Adventure Sync, Inc.</strong><br />
                Boulder, Colorado, USA<br />
                Email: legal@adventuresync.app
              </p>
              <p>
                These terms constitute the entire agreement between you and Adventure Sync regarding 
                your use of the service and supersede any prior agreements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
