
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { MobileMenu } from '@/components/ui/mobile-menu';

export function Navbar({ className }: { className?: string }) {
  const { session } = useAuth();

  const navigationLinks = [
    { name: 'Browse Recipes', path: '/recipes', requiresAuth: false },
    { name: 'Create Recipe', path: '/build', requiresAuth: true },
    { name: 'Shopping Lists', path: '/shopping-lists', requiresAuth: true },
    { name: 'How It Works', path: '/how-it-works', requiresAuth: false },
  ];

  // Filter links based on authentication status
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

  return (
    <header className={cn("border-b bg-background sticky top-0 z-50", className)}>
      <div className="container-page flex h-16 items-center">
        <div className="flex items-center gap-4 mr-auto">
          <MobileMenu />
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png" 
              alt="Recipe Alchemy Logo" 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {displayedLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Button - Hidden on Mobile */}
        <div className="hidden md:flex items-center space-x-3 ml-6">
          {session ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
