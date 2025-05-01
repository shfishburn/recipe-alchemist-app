
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { ChefHat, BookOpen, ShoppingCart, BookText, User } from 'lucide-react';

export function Navbar({ className }: { className?: string }) {
  const { session } = useAuth();
  const { isOpen, open, close } = useAuthDrawer();

  const navigationLinks = [
    { name: 'My Kitchen', path: '/quick-recipe', requiresAuth: false, icon: ChefHat },
    { name: 'My Recipes', path: '/recipes', requiresAuth: false, icon: BookOpen },
    { name: 'My Market', path: '/shopping-lists', requiresAuth: true, icon: ShoppingCart },
    { name: 'Our Science', path: '/how-it-works', requiresAuth: false, icon: BookText },
  ];

  // Filter links based on authentication status
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

  return (
    <header className={cn("border-b bg-background sticky top-0 z-50", className)}>
      <div className="container-page flex h-14 sm:h-16 md:h-20 items-center">
        <div className="flex items-center gap-2 md:gap-4 mr-auto">
          <MobileMenu />
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png" 
              alt="Recipe Alchemy Logo" 
              className="h-8 w-auto md:h-10"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {displayedLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-sm font-medium hover:text-primary transition-colors flex items-center px-3 py-2 rounded-md"
            >
              {link.icon && <link.icon className="h-4 w-4 mr-1" />}
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Button - Hidden on Mobile */}
        <div className="hidden md:flex items-center space-x-3 ml-6">
          {session ? (
            <Button variant="outline" size="sm" asChild className="h-10 py-2 px-4">
              <Link to="/profile" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={open} className="h-10 py-2 px-4">
                Log in
              </Button>
              <Button size="sm" onClick={open} className="h-10 py-2 px-4">
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
