
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/use-auth";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonWrapper } from "@/components/ui/button-wrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cleanupUIState } from "@/utils/dom-cleanup";
import { toast } from "sonner";

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
  const [pendingSave, setPendingSave] = useState<any>(null);
  
  // Check for pending actions on mount and when auth state changes
  const checkPendingActions = useCallback(() => {
    try {
      const pendingSaveData = sessionStorage.getItem('pendingSaveRecipe');
      if (pendingSaveData) {
        setPendingSave(JSON.parse(pendingSaveData));
      }
    } catch (error) {
      console.error("Error checking for pending actions:", error);
    }
  }, []);
  
  // Close drawer and navigate on successful auth
  const handleAuthSuccess = useCallback(() => {
    setOpen(false);
    cleanupUIState(); // Clean up UI state before navigating
    
    // Check if there's a pending recipe save
    try {
      const pendingSaveData = sessionStorage.getItem('pendingSaveRecipe');
      if (pendingSaveData) {
        const { recipe, sourceUrl } = JSON.parse(pendingSaveData);
        
        // If we have a valid source URL to return to, use it
        if (sourceUrl) {
          toast.success("Successfully signed in! Returning to your recipe...");
          
          // Add a small delay to allow toast to show
          setTimeout(() => {
            navigate(sourceUrl, { 
              state: { 
                pendingSave: true,
                resumingAfterAuth: true 
              }
            });
          }, 300);
          return;
        }
      }
      
      // Default navigation if no pending action
      navigate("/");
      
    } catch (error) {
      console.error("Error handling post-auth actions:", error);
      navigate("/"); // Default navigation on error
    }
  }, [setOpen, navigate]);

  // If user is already authenticated, close drawer
  useEffect(() => {
    if (session && open) {
      setOpen(false);
      cleanupUIState();
      
      // Look for pending actions whenever we close due to being authenticated
      checkPendingActions();
    }
  }, [session, open, setOpen, checkPendingActions]);
  
  // Check for pending actions when drawer opens
  useEffect(() => {
    if (open) {
      checkPendingActions();
    }
  }, [open, checkPendingActions]);

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

  // Memoize the auth form to prevent unnecessary rerenders
  const authForm = useMemo(() => (
    <AuthForm onSuccess={handleAuthSuccess} />
  ), [handleAuthSuccess]);

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
            {authForm}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

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
          {authForm}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
