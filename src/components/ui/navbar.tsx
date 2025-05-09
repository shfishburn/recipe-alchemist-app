// path: src/components/ui/navbar.tsx
// file: Navbar.tsx
// updated: 2025-05-09 15:00 PM

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
 * Global Navbar with frosted backdrop, hide-on-scroll, active link indicator,
 * and evenly distributed sections.
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

  // Navigation links
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
        'fixed inset-x-0 top-0 z-50 bg-white/70 backdrop-blur-md border-b shadow-sm transition-transform duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0',
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex h-12 items-center justify-between">
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileMenu className="p-1 rounded-md bg-white/50 hover:bg-white/60 transition" />
          <Link to="/" className="flex-shrink-0">
            <img
              src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png"
              alt="Recipe Alchemy Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          {displayedLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm font-medium px-3 py-2 rounded-md transition-colors',
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

        {/* Right: Auth Buttons */}
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

      {/* Auth Drawer */}
      <AuthDrawer open={isOpen} setOpen={state => (state ? open() : close())} />
    </header>
  );
}

export default Navbar;
