
import React from 'react';
import { QuickRecipeLoading } from './QuickRecipeLoading';

export function FullScreenLoading() {
  // Prevent back navigation during loading
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Recipe generation in progress. Are you sure you want to leave?';
    };

    const handlePopState = (e: PopStateEvent) => {
      // Prevent navigation while loading
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      
      // Optional: Show a toast that navigation is disabled during recipe creation
      console.log("Back navigation prevented during recipe generation");
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Force the current URL to be in the history stack
    window.history.pushState(null, '', window.location.pathname);

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
