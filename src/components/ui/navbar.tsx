
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { Database, Kitchen } from 'lucide-react';

export function Navbar({ className }: { className?: string }) {
  const { session } = useAuth();
  const { isOpen, open, close } = useAuthDrawer();

  // Check if user is an admin (for now, all authenticated users can access this)
  // In a real app, you'd check for a specific role or permission
  const isAdmin = !!session;

  const navigationLinks = [
    { name: 'My Recipes', path: '/recipes', requiresAuth: false },
    { name: 'My Kitchen', path: '/quick-recipe', requiresAuth: false, icon: Kitchen },
    // Hiding My Lab route
    // { name: 'My Lab', path: '/build', requiresAuth: true },
    { name: 'My Market', path: '/shopping-lists', requiresAuth: true },
    { name: 'Our Science', path: '/how-it-works', requiresAuth: false },
  ];
  
  // Add Data Import link for admins
  if (isAdmin) {
    navigationLinks.push({ name: 'Data Import', path: '/data-import', requiresAuth: true });
  }

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
              className="text-sm font-medium hover:text-primary transition-colors flex items-center"
            >
              {link.icon && <link.icon className="h-4 w-4 mr-1" />}
              {link.name === 'Data Import' && <Database className="h-4 w-4 mr-1" />}
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
