
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
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ButtonWrapper } from '@/components/ui/button-wrapper';
import { ChefHat, Menu, BookOpen, ShoppingCart, BookText, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function MobileMenu() {
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  
  // Define navigation links without Profile since it's in the button
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
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden p-2 h-12 w-12">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-[300px] sm:max-w-[320px]">
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
        <div className="mt-8 flex flex-col gap-6">
          {displayedLinks.map((link) => (
            <SheetClose asChild key={link.path}>
              <Link 
                to={link.path} 
                className="text-base font-medium hover:text-primary transition-colors flex items-center h-12 px-2"
              >
                {link.icon && React.createElement(link.icon, { className: "h-5 w-5 mr-3" })}
                {link.name}
              </Link>
            </SheetClose>
          ))}
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col gap-3">
          {session ? (
            <SheetClose asChild>
              <Button variant="outline" asChild>
                <Link to="/profile" className="w-full h-12 justify-start flex items-center">
                  <User className="h-5 w-5 mr-3" />
                  <span>Profile</span>
                </Link>
              </Button>
            </SheetClose>
          ) : (
            <>
              <Button variant="outline" className="w-full h-12" onClick={() => openAuthDrawer()}>
                Log in
              </Button>
              <Button className="w-full h-12" onClick={() => openAuthDrawer()}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
