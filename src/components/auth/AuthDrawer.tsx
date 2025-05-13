
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
import { useQuickRecipeStore } from "@/store/use-quick-recipe-store";

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

/**
 * Helper function to extract error message from unknown errors
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An error occurred";
}

export function AuthDrawer({ open, setOpen }: AuthDrawerProps) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const recipe = useQuickRecipeStore(state => state.recipe);
  const setRecipe = useQuickRecipeStore(state => state.setRecipe);
  
  // Close drawer and navigate on successful auth
  const handleAuthSuccess = useCallback(() => {
    setOpen(false);
    cleanupUIState(); // Clean up UI state before navigating
    
    // Check if there's a pending action
    const nextAction = authStateManager.getNextPendingAction();
    
    // If we have a recipe in the store, make sure to use the backup
    // mechanism to ensure it survives page refreshes
    if (recipe) {
      authStateManager.storeRecipeDataFallback(recipe);
      console.log("Backed up recipe from store on auth success:", recipe.title);
    }
    
    if (nextAction && !nextAction.executed) {
      const { type, sourceUrl, data } = nextAction;
      console.log("Found pending action on auth success:", type, "for URL:", sourceUrl);

      // Don't mark as executed yet - let the destination component handle that
      // This ensures the action is still available if navigation fails
      
      if (type === 'save-recipe' && sourceUrl) {
        toast.success("Successfully signed in! Returning to your recipe...");
        
        // Log recipe data availability for debugging
        console.log("Recipe data available for save:", {
          fromStore: !!recipe,
          fromAction: !!data.recipe,
          recipeId: data.recipeId || 'none'
        });
        
        // Navigate after a brief delay to allow toast to show
        // Using requestAnimationFrame for smoother transitions
        requestAnimationFrame(() => {
          // Prepare state object with recipe data from multiple sources
          const navState = { 
            pendingSave: true,
            resumingAfterAuth: true,
            timestamp: Date.now()
          };
          
          // Include recipeId if available
          if (data.recipeId) {
            Object.assign(navState, { recipeId: data.recipeId });
          }
          
          navigate(sourceUrl || '/recipe-preview', { 
            state: navState,
            replace: true
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
              },
              timestamp: Date.now() // Add timestamp to force navigation
            },
            replace: true
          });
        });
        return;
      }
    } else {
      // Check for fallback recipe data even if no pending action
      const recipeBackup = authStateManager.getRecipeDataFallback();
      if (recipeBackup && recipeBackup.recipe) {
        console.log("Found recipe backup in localStorage", {
          title: recipeBackup.recipe.title,
          path: recipeBackup.sourceUrl || 'unknown' 
        });
        // Restore recipe to store
        setRecipe(recipeBackup.recipe);
        
        // Navigate to recipe preview
        toast.success("Successfully signed in! Returning to your recipe...");
        requestAnimationFrame(() => {
          navigate(recipeBackup.sourceUrl || '/recipe-preview', {
            state: {
              pendingSave: true,
              resumingAfterAuth: true,
              timestamp: Date.now()
            },
            replace: true
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
      
      // Navigate with any stored state - fixed the spread type issue
      const navigationState = redirectData.state && typeof redirectData.state === 'object' 
        ? { ...redirectData.state, resumingAfterAuth: true } 
        : { resumingAfterAuth: true };
      
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
  }, [setOpen, navigate, recipe, setRecipe]);

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
