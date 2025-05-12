
import React, { useState } from 'react';
import { AuthDrawer } from '@/components/auth/AuthDrawer';
import { Button } from '@/components/ui/button';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { useAuthContext } from '@/hooks/use-auth-context';
import { BookOpen, ChefHat, LogIn, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

export function ContextAwareAuthPrompt() {
  const { open, toggle } = useAuthDrawer();
  const { context, clearContext } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Only show if we have an auth context set
  if (!context) {
    return null;
  }

  const handleLogin = () => {
    // Close the dialog/drawer and open the auth drawer
    setShowDialog(false);
    open();
  };

  const handleContinueAsGuest = () => {
    // Clear the auth context and close the dialog/drawer
    clearContext();
    setShowDialog(false);
  };

  // Different content based on context
  const getContextContent = () => {
    switch (context) {
      case 'recipe-save':
        return {
          title: "Sign In to Save Your Recipe",
          description: "Create an account to save recipes, get personalized recommendations, and access all features.",
          icon: <ChefHat className="h-12 w-12 text-recipe-green mb-4" />,
        };
      default:
        return {
          title: "Sign In to Continue",
          description: "Create an account or sign in to access all features.",
          icon: <BookOpen className="h-12 w-12 text-primary mb-4" />,
        };
    }
  };

  const { title, description, icon } = getContextContent();

  // Use Dialog for desktop and Drawer for mobile
  if (isMobile) {
    return (
      <>
        <Drawer open={showDialog} onOpenChange={setShowDialog}>
          <DrawerContent className="px-4">
            <DrawerHeader className="text-center">
              <div className="flex justify-center">{icon}</div>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <div className="flex flex-col gap-3">
                <Button onClick={handleLogin} className="w-full flex items-center justify-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button onClick={handleLogin} variant="outline" className="w-full flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </Button>
              </div>
            </div>
            <DrawerFooter>
              <Button variant="ghost" onClick={handleContinueAsGuest}>
                Continue as Guest
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <AuthDrawer open={open} setOpen={toggle} />
      </>
    );
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center">{icon}</div>
            <DialogTitle className="text-center">{title}</DialogTitle>
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button onClick={handleLogin} className="w-full flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
            <Button onClick={handleLogin} variant="outline" className="w-full flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button variant="ghost" onClick={handleContinueAsGuest}>
              Continue as Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AuthDrawer open={open} setOpen={toggle} />
    </>
  );
}

export function showAuthPrompt(context: 'recipe-save' | 'general' = 'general', options = {}) {
  // Get auth context store
  const { setContext } = useAuthContext.getState();
  
  // Set the context
  setContext(context, options);
  
  // Show dialog/drawer after setting context
  document.dispatchEvent(new CustomEvent('show-auth-prompt'));
}
