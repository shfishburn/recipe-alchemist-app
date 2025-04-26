
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

export function Navbar({ className }: { className?: string }) {
  const { session } = useAuth();

  return (
    <header className={cn("border-b bg-background sticky top-0 z-50", className)}>
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-recipe-blue/10 flex items-center justify-center">
            <span className="text-recipe-blue text-xl font-bold">R</span>
          </div>
          <span className="font-bold text-lg">Recipe Alchemist</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/recipes" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Recipes
          </Link>
          {session ? (
            <>
              <Link to="/build" className="text-sm font-medium hover:text-primary transition-colors">
                Create Recipe
              </Link>
              <Link to="/favorites" className="text-sm font-medium hover:text-primary transition-colors">
                Favorites
              </Link>
              <Link to="/shopping-lists" className="text-sm font-medium hover:text-primary transition-colors">
                Shopping Lists
              </Link>
              <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                Profile
              </Link>
            </>
          ) : null}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {session ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/profile">My Account</Link>
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
