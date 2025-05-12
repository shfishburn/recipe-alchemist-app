
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';

/**
 * ContextAwareAuthDrawer provides a responsive authentication interface
 * that adapts to different contexts (recipe saving, general login, etc.)
 * and device types (mobile vs desktop)
 */
export const ContextAwareAuthDrawer: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { toast } = useToast();
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Access auth context information
  const {
    context,
    returnPath,
    formData,
    recipe,
    clearContext
  } = useAuthContext();

  // Show auth interface when context is set
  useEffect(() => {
    if (context) {
      setShowAuth(true);
    }
  }, [context]);

  // Handle closing of the auth interface
  const handleClose = () => {
    setShowAuth(false);
    clearContext();
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    // Close the auth interface
    setShowAuth(false);
    
    // Redirect or perform context-specific actions
    if (returnPath) {
      navigate(returnPath);
    }
    
    // Show success toast based on context
    if (context === 'recipe-save') {
      toast({
        title: "Authentication successful!",
        description: "You can now save your recipe.",
        variant: "success"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
        variant: "success"
      });
    }
    
    // Clear the context after processing
    clearContext();
  };

  // Handle "Continue as Guest" option
  const handleContinueAsGuest = () => {
    setShowAuth(false);
    
    toast({
      title: "Continuing as guest",
      description: context === 'recipe-save' 
        ? "Your recipe won't be saved to your account." 
        : "You can sign in later from your profile.",
      variant: "default"
    });
    
    clearContext();
  };

  // If there's no context, don't render anything
  if (!context) {
    return null;
  }

  // Content common to both Dialog and Drawer
  const authContent = (
    <div className="flex flex-col space-y-6 py-2">
      {/* Context-aware heading */}
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-xl font-semibold tracking-tight">
          {context === 'recipe-save'
            ? "Sign in to save your recipe"
            : "Welcome to Recipe Alchemy"}
        </h2>
        <p className="text-muted-foreground">
          {context === 'recipe-save'
            ? "Your account lets you save recipes, create shopping lists, and more."
            : "Sign in to access all features including saved recipes and meal plans."}
        </p>
      </div>
      
      {/* Auth form with success callback */}
      <AuthForm onAuthSuccess={handleAuthSuccess} />
      
      {/* Continue as guest option */}
      {context === 'recipe-save' && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or
            </span>
          </div>
        </div>
      )}
      
      {context === 'recipe-save' && (
        <Button 
          variant="outline" 
          onClick={handleContinueAsGuest}
        >
          Continue as guest
        </Button>
      )}
    </div>
  );

  // Use Dialog for desktop and Drawer for mobile
  return isMobile ? (
    <Drawer open={showAuth} onOpenChange={setShowAuth}>
      <DrawerContent className="px-4 pb-6">
        {authContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={showAuth} onOpenChange={setShowAuth}>
      <DialogContent className="sm:max-w-[425px]">
        {authContent}
      </DialogContent>
    </Dialog>
  );
};

export default ContextAwareAuthDrawer;
