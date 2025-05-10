
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
 * Global navigation bar with horizontal layout
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
        'fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm transition-transform duration-300 py-4',
        hidden ? '-translate-y-full' : 'translate-y-0',
        className
      )}
    >
      <div className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Mobile menu button and logo together on the left */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
            
            {/* Logo - Fixed size to prevent layout issues */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png"
                alt="Recipe Alchemy Logo"
                className="h-8 w-auto max-h-8"
              />
            </Link>
          </div>

          {/* Navigation Links centered */}
          <nav className="hidden md:flex items-center space-x-10">
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

          {/* Auth Buttons on the right */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <Button variant="outline" size="sm" asChild className="h-9 px-4">
                <Link to="/profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            ) : (
              <>  
                <Button variant="outline" size="sm" onClick={open} className="h-9 px-4">
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={open}
                  className="h-9 px-4 bg-recipe-green text-white hover:bg-recipe-green/90"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthDrawer open={isOpen} setOpen={state => (state ? open() : close())} />
    </header>
  );
}

export default Navbar;
