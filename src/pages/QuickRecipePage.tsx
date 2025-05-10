
import React, { useEffect } from 'react';
import { QuickRecipeHero } from '@/components/quick-recipe/hero/QuickRecipeHero';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { QuickRecipeError } from '@/components/quick-recipe/error/QuickRecipeError';
import { QuickRecipeEmpty } from '@/components/quick-recipe/empty/QuickRecipeEmpty';
import { FullScreenLoading } from '@/components/quick-recipe/FullScreenLoading';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { useQuickRecipePage } from '@/hooks/use-quick-recipe-page';
import { PageContainer } from '@/components/ui/containers';
import { forceCleanupUI, checkAndCleanupLoadingUI } from '@/utils/dom-cleanup';

const QuickRecipePage: React.FC = () => {
  const {
    recipe,
    isLoading,
    isRetrying,
    error,
    formData,
    isDirectNavigation,
    hasTimeoutError,
    handleRetry,
    handleCancel,
    toggleDebugMode,
    debugMode,
  } = useQuickRecipePage();

  // Force show loading indicator for navigation and clean up on unmount
  useEffect(() => {
    console.log('QuickRecipePage mounted', { isLoading, isRetrying, error });
    
    // Clean up any stale loading UI immediately on mount
    if (!isLoading && !isRetrying) {
      forceCleanupUI();
    }
    
    // Set up periodic checks for orphaned loading UI
    const cleanupInterval = setInterval(checkAndCleanupLoadingUI, 5000);
    
    return () => {
      console.log('QuickRecipePage unmounted');
      clearInterval(cleanupInterval);
      
      // Force cleanup when unmounting
      forceCleanupUI();
    };
  }, []);

  // Manage body overflow based on loading state changes
  useEffect(() => {
    console.log('QuickRecipePage state change', { 
      isLoading, 
      isRetrying, 
      hasRecipe: !!recipe, 
      hasError: !!error 
    });
  }, [isLoading, isRetrying, recipe, error]);

  // Full-screen loading while generating or retrying
  if (isLoading || isRetrying) {
    console.log('Rendering loading state in QuickRecipePage', { isLoading, isRetrying });
    return (
      <div 
        className="h-screen w-screen fixed top-0 left-0 z-[9999] bg-white dark:bg-gray-950"
        aria-busy="true"
        aria-live="polite"
      >
        <LoadingIndicator />
        <FullScreenLoading
          onCancel={handleCancel}
          onRetry={error ? handleRetry : undefined}
          error={error}
        />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <QuickRecipeHero
          hasRecipe={!!recipe}
          toggleDebugMode={toggleDebugMode}
          debugMode={debugMode}
        />

        {isDirectNavigation ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-6">
            <QuickRecipeFormContainer />
          </div>
        ) : error ? (
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
          <div className="space-y-8">
            <QuickRecipeDisplay recipe={recipe} />
            <QuickRecipeRegeneration 
              formData={formData} 
              isLoading={isLoading} 
              onRetry={handleRetry} 
            />
          </div>
        ) : (
          <QuickRecipeEmpty />
        )}
      </div>
    </PageContainer>
  );
};

export default QuickRecipePage;
