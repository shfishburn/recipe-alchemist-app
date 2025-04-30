
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChefHat, Database, Menu, BookOpen, ShoppingCart, BookText, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function MobileMenu() {
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  
  // Check if user is an admin (for now, all authenticated users can access this)
  const isAdmin = !!session;

  // Define navigation links without Profile since it's in the button
  const navigationLinks = [
    { name: 'My Recipes', path: '/recipes', requiresAuth: false, icon: BookOpen },
    { name: 'My Kitchen', path: '/quick-recipe', requiresAuth: false, icon: ChefHat },
    // Hiding My Lab route
    // { name: 'My Lab', path: '/build', requiresAuth: true },
    { name: 'My Market', path: '/shopping-lists', requiresAuth: true, icon: ShoppingCart },
    { name: 'Our Science', path: '/how-it-works', requiresAuth: false, icon: BookText },
  ];

  // Add Data Import link for admins
  if (isAdmin) {
    navigationLinks.push({ name: 'Data Import', path: '/data-import', requiresAuth: true, icon: Database });
  }

  // Filter links based on authentication status
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

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
          <SheetTitle>
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png" 
                alt="Recipe Alchemy Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-4">
          {displayedLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-sm font-medium hover:text-primary transition-colors flex items-center"
            >
              {link.icon && <link.icon className="h-4 w-4 mr-2" />}
              {link.name}
            </Link>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          {session ? (
            <Button variant="outline" asChild className="w-full">
              <Link to="/profile" className="flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" className="w-full" onClick={() => openAuthDrawer()}>
                Log in
              </Button>
              <Button className="w-full" onClick={() => openAuthDrawer()}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
