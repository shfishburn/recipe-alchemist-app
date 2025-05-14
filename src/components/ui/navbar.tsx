
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MobileMenu } from '@/components/ui/mobile-menu';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Global navigation bar with horizontal layout
 */
export function Navbar({ className = '' }: { className?: string }) {
  const { session, signOut } = useAuth();
  const { isOpen, open, close } = useAuthDrawer();
  const location = useLocation();
  const { toast } = useToast();
  
  // Local state to track logout process
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    { name: 'Material', path: '/material-showcase' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Market', path: '/shopping-lists', requiresAuth: true },
    { name: 'Science', path: '/how-it-works' },
  ];
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || session
  );

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    
    try {
      await signOut();
      toast({
        title: "Logout Successful",
        description: "You have been logged out successfully",
        variant: "success",
      });
    } catch (error) {
      // Safe error handling without exposing sensitive information
      console.error("Logout error:", error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Logout Failed",
        description: "There was an issue signing you out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm transition-transform duration-300 py-3',
        hidden ? '-translate-y-full' : 'translate-y-0',
        className
      )}
    >
      <div className="container-page">
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
                src="/lovable-uploads/recipe-alchemy-logo.png"
                alt="Recipe Alchemy Logo"
                className="h-8 w-auto max-h-8"
              />
            </Link>
          </div>

          {/* Navigation Links centered */}
          <nav className="hidden md:flex items-center space-x-8">
            {displayedLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium px-3 py-2 rounded-md transition-colors material-elevation-transition',
                    active
                      ? 'text-white bg-primary hover:bg-primary/90 shadow-elevation-1'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-100/50'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth buttons (consistent on desktop and mobile) */}
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={open}>
                  Log in
                </Button>
                <Button variant="filled" size="sm" onClick={open} className="shadow-elevation-1">
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
