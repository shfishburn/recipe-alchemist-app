
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function MobileMenu() {
  const { session } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-recipe-blue/10 flex items-center justify-center">
              <span className="text-recipe-blue text-xl font-bold">R</span>
            </div>
            <span className="font-bold text-lg">Recipe Alchemist</span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
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
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          {session ? (
            <Button variant="outline" asChild className="w-full">
              <Link to="/profile">My Account</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild className="w-full">
                <Link to="/auth">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/auth">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
