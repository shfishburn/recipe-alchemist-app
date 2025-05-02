
import React, { useEffect } from 'react';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { toast } from '@/hooks/use-toast';

export function FullScreenLoading() {
  // Improve the navigation block during loading to be less intrusive
  useEffect(() => {
    let navigationAttempted = false;
    
    // Instead of completely blocking navigation, warn the user
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = 'Recipe generation in progress. Are you sure you want to leave?';
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    // Use a more user-friendly approach for back button
    const handlePopState = (e: PopStateEvent) => {
      if (!navigationAttempted) {
        e.preventDefault();
        
        // Show a toast with warning instead of completely blocking
        toast({
          title: "Recipe generation in progress",
          description: "Please wait until complete, or reload the page to cancel.",
          variant: "destructive",
          duration: 5000,
        });
        
        // Add current state to history so back button works after multiple attempts
        window.history.pushState(null, '', window.location.pathname);
        
        navigationAttempted = true;
        
        // Reset the flag after a short delay so multiple taps are not needed
        setTimeout(() => {
          navigationAttempted = false;
        }, 2000);
      }
    };

    // Add event listeners with passive option for better performance
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Ensure we don't break browser history by only pushing once
    if (window.history.state !== 'loading') {
      window.history.pushState('loading', '', window.location.pathname);
    }

    return () => {
      // Clean up event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="w-full max-w-md mx-auto px-4">
        <QuickRecipeLoading />
      </div>
    </div>
  );
}
