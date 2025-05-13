
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect } from "react";
import { cleanupUIState } from "@/utils/dom-cleanup";
import { toast } from "sonner";
import { authStateManager } from "@/lib/auth/auth-state-manager";

// For desktop
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

// For mobile
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import AuthForm from "@/components/auth/AuthForm";

interface AuthDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AuthDrawer({ open, setOpen }: AuthDrawerProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Close drawer and navigate on successful auth
  const handleAuthSuccess = useCallback(() => {
    setOpen(false);
    cleanupUIState(); // Clean up UI state before navigating
    
    // Check if there's a pending action
    const nextAction = authStateManager.getNextPendingAction();
    if (nextAction && !nextAction.executed) {
      const { type, sourceUrl, data } = nextAction;

      // Don't mark as executed yet - let the destination component handle that
      // This ensures the action is still available if navigation fails
      
      if (type === 'save-recipe' && sourceUrl) {
        toast.success("Successfully signed in! Returning to your recipe...");
        
        // Navigate after a brief delay to allow toast to show
        // Using requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
          navigate(sourceUrl, { 
            state: { 
              pendingSave: true,
              resumingAfterAuth: true 
            }
          });
        });
        return;
      } else if (type === 'generate-recipe' && data.formData) {
        toast.success("Successfully signed in! Resuming recipe generation...");
        
        // Navigate based on the saved path
        requestAnimationFrame(() => {
          navigate(sourceUrl || '/quick-recipe', { 
            state: { 
              resumingGeneration: true,
              recipeData: {
                formData: data.formData,
                path: sourceUrl
              }
            }
          });
        });
        return;
      }
    }
    
    // Handle regular redirect if no pending actions
    const redirectData = authStateManager.getRedirectAfterAuth();
    if (redirectData) {
      let redirectTo = redirectData.pathname;
      
      // Add search params and hash if they exist
      if (redirectData.search) redirectTo += redirectData.search;
      if (redirectData.hash) redirectTo += redirectData.hash;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("Auth success - redirecting to:", redirectTo);
      }
      
      // Navigate with any stored state - simplified using optional chaining
      const navigationState = redirectData.state ? 
        { ...redirectData.state, resumingAfterAuth: true } : 
        { resumingAfterAuth: true };
      
      navigate(redirectTo, { 
        state: navigationState,
        replace: true
      });
      
      // Clear the redirect after using it
      authStateManager.clearRedirectAfterAuth();
      return;
    }
    
    // Default navigation if no pending redirect
    navigate("/");
  }, [setOpen, navigate]);

  // If user is already authenticated, close drawer
  useEffect(() => {
    if (session && open) {
      setOpen(false);
      cleanupUIState();
    }
  }, [session, open, setOpen]);

  // When the drawer closes, ensure UI state is cleaned up
  useEffect(() => {
    if (!open) {
      // Small delay to allow animations to complete
      const timeout = setTimeout(() => {
        cleanupUIState();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen);
        // Clean up when closed
        if (!newOpen) {
          setTimeout(() => cleanupUIState(), 300);
        }
      }}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="flex items-center justify-between border-b pb-4">
            <DrawerTitle className="text-center">Account</DrawerTitle>
            <DrawerClose>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <ScrollArea className="p-6 h-full max-h-[70vh]">
            <AuthForm onSuccess={handleAuthSuccess} />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sheet
  return (
    <Sheet open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      // Clean up when closed
      if (!newOpen) {
        setTimeout(() => cleanupUIState(), 300);
      }
    }}>
      <SheetContent side="right" className="w-full max-w-md border-l">
        <SheetHeader className="flex items-center justify-between border-b pb-4">
          <SheetTitle>Account</SheetTitle>
          <SheetClose>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex-1 p-6 h-full">
          <AuthForm onSuccess={handleAuthSuccess} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
