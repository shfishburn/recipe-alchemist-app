
// path: src/components/ui/navbar.tsx
// file: Navbar.tsx
// updated: 2025-05-09 15:10 PM

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Global Navbar with horizontal layout and properly separated components.
 */
export function Navbar({ className = '' }: { className?: string }) {
  const { session } = useAuth();
  const { isOpen, open, close } = useAuthDrawer();
  const location = useLocation();

  // Hide on scroll down, show on scroll up
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 50);
      setLastY(y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  const navigationLinks = [
    { name: 'Kitchen', path: '/' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Market', path: '/shopping-lists', requiresAuth: true },
    { name: 'Science', path: '/how-it-works' },
  ];
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || session
  );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-white/80 border-b shadow-sm transition-transform duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0',
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Left side: Mobile menu and logo */}
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Link to="/" className="flex-shrink-0">
            <img
              src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png"
              alt="Recipe Alchemy Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center justify-center space-x-6">
          {displayedLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium px-2 py-1 transition-colors',
                  active
                    ? 'text-recipe-green border-b-2 border-recipe-green'
                    : 'text-gray-700 hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Auth Buttons */}
        <div className="flex items-center space-x-3">
          {session ? (
            <Button variant="outline" size="sm" asChild className="h-8 px-3">
              <Link to="/profile" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={open} className="h-8 px-3">
                Log in
              </Button>
              <Button
                size="sm"
                onClick={open}
                className="h-8 px-3 bg-recipe-green text-white hover:bg-recipe-green/90"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      <AuthDrawer open={isOpen} setOpen={state => (state ? open() : close())} />
    </header>
  );
}

export default Navbar;
