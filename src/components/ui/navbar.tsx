import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { MobileMenu } from '@/components/ui/mobile-menu';

export function Navbar({ className }: { className?: string }) {
  const { session } = useAuth();

  // Define all navigation links including those that require authentication
  const navigationLinks = [
    { name: 'Browse Recipes', path: '/recipes', requiresAuth: false },
    { name: 'Create Recipe', path: '/build', requiresAuth: true },
    { name: 'Shopping Lists', path: '/shopping-lists', requiresAuth: true },
    { name: 'Profile', path: '/profile', requiresAuth: true },
  ];

  // Filter links based on authentication status
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

  return (
    <header className={cn("border-b bg-background sticky top-0 z-50", className)}>
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-recipe-blue/10 flex items-center justify-center">
              <span className="text-recipe-blue text-xl font-bold">R</span>
            </div>
            <span className="font-bold text-lg">Recipe Alchemist</span>
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
        <div className="hidden md:flex items-center space-x-3">
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
