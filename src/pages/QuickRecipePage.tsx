
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/ui/navbar';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { FullScreenLoading } from '@/components/quick-recipe/FullScreenLoading';
import { QuickRecipeHero } from '@/components/quick-recipe/hero/QuickRecipeHero';
import { QuickRecipeError } from '@/components/quick-recipe/error/QuickRecipeError';
import { QuickRecipeEmpty } from '@/components/quick-recipe/empty/QuickRecipeEmpty';
import { useQuickRecipePage } from '@/hooks/use-quick-recipe-page';
import { LoadingIndicator } from '@/components/ui/loading-indicator';

const QuickRecipePage = () => {
  const {
    recipe,
    isLoading,
    formData,
    error,
    hasTimeoutError,
    isRetrying,
    debugMode,
    isDirectNavigation,
    handleRetry,
    handleCancel,
    toggleDebugMode
  } = useQuickRecipePage();
  
  const loadingTriggerRef = useRef<HTMLDivElement | null>(null);
  
  // Force show loading indicator for navigation - optimized
  useEffect(() => {
    // Create the loading trigger element only once
    if (!loadingTriggerRef.current) {
      loadingTriggerRef.current = document.createElement('div');
      loadingTriggerRef.current.className = 'loading-trigger';
      // Use requestAnimationFrame for smoother insertion
      requestAnimationFrame(() => {
        document.body.appendChild(loadingTriggerRef.current!);
      });
    }
    
    return () => {
      // Ensure we clean up any loading states when component unmounts
      document.body.classList.remove('overflow-hidden');
      if (loadingTriggerRef.current && loadingTriggerRef.current.parentNode) {
        // Use requestAnimationFrame for smoother removal
        requestAnimationFrame(() => {
          if (loadingTriggerRef.current?.parentNode) {
            document.body.removeChild(loadingTriggerRef.current);
            loadingTriggerRef.current = null;
          }
        });
      }
    };
  }, []);

  // Show full-screen loading when generating a recipe
  if (isLoading || isRetrying) {
    return (
      <>
        <LoadingIndicator />
        <div className="min-h-screen w-full relative touch-action-auto">
          <FullScreenLoading 
            onCancel={handleCancel}
            onRetry={error ? handleRetry : undefined}
            error={error}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LoadingIndicator />
      <main className="flex-1 py-6 md:py-10 w-full">
        <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Title Section - Always show this */}
          <QuickRecipeHero 
            hasRecipe={!!recipe} 
            toggleDebugMode={toggleDebugMode}
            debugMode={debugMode}
          />

          {isDirectNavigation ? (
            // Show form directly when navigating from navbar
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-md mx-auto mb-10 md:max-w-xl lg:max-w-2xl">
              <QuickRecipeFormContainer />
            </div>
          ) : error ? (
            // Show error state
            <QuickRecipeError 
              error={error}
              hasTimeoutError={hasTimeoutError}
              debugMode={debugMode}
              formData={formData}
              onCancel={handleCancel}
              onRetry={handleRetry}
              isRetrying={isRetrying}
            />
          ) : recipe ? (
            // Show recipe
            <>
              <QuickRecipeDisplay recipe={recipe} />
              <div className="mt-6 mb-10">
                <QuickRecipeRegeneration formData={formData} isLoading={isLoading} />
              </div>
            </>
          ) : (
            // Show empty state
            <QuickRecipeEmpty />
          )}
        </div>
      </main>
    </>
  );
}

export default QuickRecipePage;
