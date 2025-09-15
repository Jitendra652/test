import { Link } from 'wouter';
import { Mountain, Facebook, Twitter, Instagram, Smartphone, RotateCcw } from 'lucide-react';

export function Footer() {
  const footerSections = [
    {
      title: 'Features',
      links: [
        { name: 'Event Discovery', href: '/events' },
        { name: 'Budget Tracking', href: '/budget' },
        { name: 'Device Sync', href: '/dashboard' },
        { name: 'Analytics', href: '/analytics' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'API Documentation', href: '/api/v1/docs' },
        { name: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'About Us', href: '/about' },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border mt-16" data-testid="footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-card-foreground">Adventure Sync</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Discover budget-friendly outdoor adventures and sync your experiences across all devices.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors" data-testid="button-social-facebook">
                <Facebook className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors" data-testid="button-social-twitter">
                <Twitter className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors" data-testid="button-social-instagram">
                <Instagram className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-card-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-card-foreground transition-colors" data-testid={`link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 Adventure Sync. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>PWA Ready</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span>Real-time Sync</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
