import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';
import {
  Shield,
  Eye,
  Database,
  Share2,
  Cookie,
  Settings,
  Lock,
  Mail,
  AlertTriangle,
  Download,
} from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: Shield,
      content: [
        'Adventure Sync is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data.',
        'We believe in transparency and want you to understand exactly how your information is handled when you use our service.',
        'This policy applies to all users of Adventure Sync, including both free and premium subscribers.',
      ],
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Account Information: Name, email address, username, location, and profile preferences.',
        'Usage Data: How you interact with our service, features used, events joined, and activity patterns.',
        'Payment Information: Billing details processed securely through PayPal (we do not store credit card numbers).',
        'Device Information: Device type, operating system, browser type, and IP address for security and optimization.',
        'Content: Files you upload, event listings you create, and messages you send through our platform.',
      ],
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: Settings,
      content: [
        'Provide and improve our services, including personalized event recommendations.',
        'Process payments and manage your subscription.',
        'Send important updates, security alerts, and service notifications.',
        'Analyze usage patterns to improve our platform and develop new features.',
        'Ensure platform security and prevent fraud or abuse.',
        'Comply with legal obligations and resolve disputes.',
      ],
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: Share2,
      content: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'Event Information: When you join public events, other participants may see your name and profile.',
        'Service Providers: We share limited data with trusted partners who help us operate our service (payment processing, email delivery, analytics).',
        'Legal Requirements: We may disclose information when required by law or to protect our rights and safety.',
        'Business Transfers: In the event of a merger or acquisition, user data may be transferred with appropriate safeguards.',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: Cookie,
      content: [
        'We use essential cookies to maintain your login session and remember your preferences.',
        'Analytics cookies help us understand how users interact with our platform to improve the experience.',
        'You can control cookie settings through your browser, though some features may not work without essential cookies.',
        'We do not use cookies for advertising or tracking across other websites.',
      ],
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: Lock,
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All data transmission is encrypted using SSL/TLS protocols.',
        'Access to personal data is restricted to authorized personnel only.',
        'We regularly review and update our security practices.',
        'In the event of a data breach, we will notify affected users promptly as required by law.',
      ],
    },
    {
      id: 'rights',
      title: 'Your Privacy Rights',
      icon: Eye,
      content: [
        'Access: You can request a copy of all personal data we have about you.',
        'Correction: You can update or correct inaccurate personal information at any time.',
        'Deletion: You can request deletion of your personal data (subject to legal retention requirements).',
        'Portability: You can request your data in a machine-readable format.',
        'Objection: You can object to certain types of data processing.',
        'Withdraw Consent: You can withdraw consent for optional data uses at any time.',
      ],
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: Database,
      content: [
        'We retain personal information only as long as necessary to provide our services.',
        'Account information is kept until you delete your account or request deletion.',
        'Payment records are retained for 7 years for tax and legal compliance.',
        'Usage analytics are anonymized after 2 years.',
        'Backup data is automatically deleted after 90 days.',
      ],
    },
  ];

  const dataTypes = [
    { category: 'Personal Data', description: 'Name, email, location', retention: 'Until account deletion' },
    { category: 'Usage Analytics', description: 'App interactions, features used', retention: '2 years (anonymized)' },
    { category: 'Payment Records', description: 'Transaction history, billing info', retention: '7 years' },
    { category: 'Event Data', description: 'Events created/joined, activity logs', retention: 'Until account deletion' },
    { category: 'Support Data', description: 'Help requests, correspondence', retention: '3 years' },
  ];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="privacy-page">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Last updated: January 1, 2024
          </p>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Your Privacy Matters</h3>
                  <p className="text-sm text-muted-foreground">
                    We are committed to protecting your privacy and being transparent about how we collect, 
                    use, and protect your personal information. This policy explains our practices in clear, simple terms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Your Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center space-x-2" data-testid="button-download-data">
                <Download className="w-4 h-4" />
                <span>Download My Data</span>
              </Button>
              <Button variant="outline" asChild data-testid="button-privacy-settings">
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Link>
              </Button>
              <Button variant="outline" asChild data-testid="button-contact-privacy">
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Privacy Questions
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Types Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data We Collect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Data Category</th>
                    <th className="text-left py-2 font-semibold">Description</th>
                    <th className="text-left py-2 font-semibold">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTypes.map((type, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium" data-testid={`data-category-${index}`}>{type.category}</td>
                      <td className="py-3 text-muted-foreground" data-testid={`data-description-${index}`}>{type.description}</td>
                      <td className="py-3 text-muted-foreground" data-testid={`data-retention-${index}`}>{type.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={section.id} id={section.id} className="scroll-mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <section.icon className="w-6 h-6 text-primary" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <div key={pIndex}>
                      {paragraph.includes(':') ? (
                        <div className="mb-2" data-testid={`section-${section.id}-item-${pIndex}`}>
                          <strong className="text-foreground">
                            {paragraph.split(':')[0]}:
                          </strong>
                          <span className="text-muted-foreground ml-1">
                            {paragraph.split(':').slice(1).join(':')}
                          </span>
                        </div>
                      ) : (
                        <p
                          className="text-muted-foreground leading-relaxed"
                          data-testid={`section-${section.id}-paragraph-${pIndex}`}
                        >
                          {paragraph}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GDPR and Rights Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Exercising Your Rights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              You have several rights regarding your personal data under privacy laws including GDPR and CCPA. 
              You can exercise these rights by contacting us or using your account settings.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">How to Exercise Your Rights</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Email us at privacy@adventuresync.app</li>
                  <li>• Use your account settings for basic changes</li>
                  <li>• Contact our support team through the app</li>
                  <li>• We'll respond within 30 days</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3">What You Can Request</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Copy of all your personal data</li>
                  <li>• Correction of inaccurate information</li>
                  <li>• Deletion of your account and data</li>
                  <li>• Export your data to another service</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Privacy Questions?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              we're here to help. Our privacy team is dedicated to ensuring your data is protected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild data-testid="button-contact-privacy-team">
                <Link href="/contact">Contact Privacy Team</Link>
              </Button>
              <Button variant="outline" asChild data-testid="button-terms-service">
                <Link href="/terms">Terms of Service</Link>
              </Button>
            </div>
            <Separator className="my-6" />
            <div className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong>Data Protection Officer</strong><br />
                Adventure Sync, Inc.<br />
                Boulder, Colorado, USA<br />
                Email: privacy@adventuresync.app
              </p>
              <p>
                This Privacy Policy may be updated from time to time. We will notify users of significant 
                changes via email or through the application.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
