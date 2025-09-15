import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Mountain, Menu, Sun, Moon, Bell, User, Settings, LogOut } from 'lucide-react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigation = [
    { name: 'Discover', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Budget', href: '/budget' },
    ...(isAuthenticated ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
  ];

  const NavLinks = ({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-4' : 'hidden md:flex items-center space-x-6'}`}>
      {navigation.map((item) => (
        <Link key={item.name} href={item.href} onClick={onClick}>
          <span className={`text-foreground hover:text-primary transition-colors ${
            location === item.href ? 'text-primary font-medium' : ''
          }`}>
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3" data-testid="link-logo">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Adventure Sync</h1>
        </Link>

        {/* Desktop Navigation */}
        <NavLinks />

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="button-user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center space-x-2" data-testid="link-settings">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild data-testid="button-login">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild data-testid="button-register">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-6">
                <NavLinks mobile onClick={() => setShowMobileMenu(false)} />
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-6 border-t border-border">
                    <Button variant="ghost" asChild onClick={() => setShowMobileMenu(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild onClick={() => setShowMobileMenu(false)}>
                      <Link href="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}

                {isAuthenticated && user && (
                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {user.name?.charAt(0) || <User className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.plan} Plan</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
