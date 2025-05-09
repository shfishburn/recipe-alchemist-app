// path: src/components/ui/navbar.tsx
// file: Navbar.tsx
// updated: 2025-05-09 14:45 PM

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { PageContainer } from '@/components/ui/containers';
import { User } from 'lucide-react';

/**
 * Navbar with frosted backdrop, scroll-hide behavior, active link indicator,
 * reduced height, and persistent CTA styling.
 */
export function Navbar({ className = '' }: { className?: string }) {
  const { session } = useAuth();
  const { isOpen, open, close } = useAuthDrawer();
  const location = useLocation();

  // Hide-on-scroll logic
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
    { name: 'My Kitchen', path: '/quick-recipe', requiresAuth: false },
    { name: 'My Recipes', path: '/recipes', requiresAuth: false },
    { name: 'My Market', path: '/shopping-lists', requiresAuth: true },
    { name: 'Our Science', path: '/how-it-works', requiresAuth: false },
  ];

  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-transform duration-300 
        bg-white/70 backdrop-blur-md border-b shadow-sm 
        ${hidden ? '-translate-y-full' : 'translate-y-0'} ${className}`}
    >
      <PageContainer>
        <div className="flex h-12 items-center">
          <MobileMenu className="bg-white/70 p-1 rounded-md hover:bg-white/80 transition" />
          <Link to="/" className="flex items-center ml-4">
            <img
              src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png"
              alt="Logo"
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex ml-8 space-x-6">
            {displayedLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors 
                    ${active ? 'text-recipe-green border-b-2 border-recipe-green' : 'text-gray-700 hover:text-primary'}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center space-x-3">
            {session ? (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex items-center gap-1.5 h-8 px-3"
              >
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </Button>
            ) : (
              <>  
                <Button
                  variant="outline"
                  size="sm"
                  onClick={open}
                  className="h-8 px-3"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={open}
                  className="h-8 px-3 bg-recipe-green hover:bg-recipe-green/90 text-white"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </PageContainer>
      <AuthDrawer open={isOpen} setOpen={state => (state ? open() : close())} />
    </header>
  );
}

export default Navbar;
