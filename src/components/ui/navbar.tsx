import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';

export function Navbar({ className }: { className?: string }) {
  const { session } = useAuth();
  const { isOpen, open, close } = useAuthDrawer();

  const navigationLinks = [
    { name: 'My Kitchen', path: '/recipes', requiresAuth: false },
    // Hiding My Lab route
    // { name: 'My Lab', path: '/build', requiresAuth: true },
    { name: 'My Market', path: '/shopping-lists', requiresAuth: true },
    { name: 'Our Science', path: '/how-it-works', requiresAuth: false },
  ];

  // Filter links based on authentication status
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

  return (
    <header className={cn("border-b bg-background sticky top-0 z-50", className)}>
      <div className="container-page flex h-20 items-center">
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
              <Button variant="outline" size="sm" onClick={open}>
                Log in
              </Button>
              <Button size="sm" onClick={open}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Auth Drawer */}
      <AuthDrawer open={isOpen} setOpen={(state) => state ? open() : close()} />
    </header>
  );
}

export default Navbar;
