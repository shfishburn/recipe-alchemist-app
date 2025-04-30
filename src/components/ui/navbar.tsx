import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './button';
import { Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary font-medium' : 'text-foreground';
  };

  return (
    <header className="border-b bg-background">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo and Nav Links */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">NutriSynth</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/recipes" className={`text-sm transition-colors hover:text-primary ${isActive('/recipes')}`}>
              Recipes
            </Link>
            {user && (
              <>
                <Link to="/shopping-lists" className={`text-sm transition-colors hover:text-primary ${isActive('/shopping-lists')}`}>
                  Shopping Lists
                </Link>
                <Link to="/data-import" className={`text-sm transition-colors hover:text-primary ${isActive('/data-import')}`}>
                  Data Import
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Auth Buttons and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          {!user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {profile?.full_name || user.email}
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-2/3 md:w-1/2">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the app
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-4 text-left pt-8">
                <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/recipes" className="text-lg font-medium hover:text-primary transition-colors">
                  Recipes
                </Link>
                {user && (
                  <>
                    <Link to="/shopping-lists" className="text-lg font-medium hover:text-primary transition-colors">
                      Shopping Lists
                    </Link>
                     <Link to="/data-import" className="text-lg font-medium hover:text-primary transition-colors">
                      Data Import
                    </Link>
                    <Link to="/profile" className="text-lg font-medium hover:text-primary transition-colors">
                      Profile
                    </Link>
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link to="/login" className="text-lg font-medium hover:text-primary transition-colors">
                      Login
                    </Link>
                    <Button asChild variant="outline">
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
