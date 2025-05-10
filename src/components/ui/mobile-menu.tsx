
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
import { Menu, User, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function MobileMenu() {
  const { session, signOut } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  
  // Define navigation links without Profile since it's in the button
  const navigationLinks = [
    { name: 'Kitchen', path: '/', requiresAuth: false },
    { name: 'Recipes', path: '/recipes', requiresAuth: false },
    { name: 'Market', path: '/shopping-lists', requiresAuth: true },
    { name: 'Science', path: '/how-it-works', requiresAuth: false },
  ];

  // Filter links based on authentication status
  const displayedLinks = navigationLinks.filter(
    link => !link.requiresAuth || (link.requiresAuth && session)
  );

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="mr-2 p-2 h-10 w-10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-[300px] sm:max-w-[320px]">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/2a8da736-fae3-4c6a-8212-c5786dfd4677.png" 
                alt="Recipe Alchemy Logo" 
                className="h-8 w-auto max-h-8"
              />
            </Link>
          </SheetTitle>
          <SheetClose className="rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <nav className="mt-8">
          <ul className="flex flex-col gap-4">
            {displayedLinks.map((link) => (
              <li key={link.path}>
                <SheetClose asChild>
                  <Link 
                    to={link.path} 
                    className="text-base font-medium hover:text-primary transition-colors flex items-center h-12 px-2"
                  >
                    <span>{link.name}</span>
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <Separator className="my-6" />
        <div className="flex flex-col gap-3">
          {session ? (
            <>
              <SheetClose asChild>
                <Button variant="outline" asChild>
                  <Link to="/profile" className="w-full h-12 justify-start flex items-center">
                    <User className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </Link>
                </Button>
              </SheetClose>
              <Button 
                variant="outline" 
                className="w-full h-12 justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </Button>
            </>
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
