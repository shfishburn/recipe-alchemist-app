
import React, { useEffect } from 'react';
import { QuickRecipeHero } from '@/components/quick-recipe/hero/QuickRecipeHero';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { QuickRecipeError } from '@/components/quick-recipe/error/QuickRecipeError';
import { QuickRecipeEmpty } from '@/components/quick-recipe/empty/QuickRecipeEmpty';
import { FullScreenLoading } from '@/components/quick-recipe/FullScreenLoading';
import { useQuickRecipePage } from '@/hooks/use-quick-recipe-page';
import { PageContainer } from '@/components/ui/containers';
import { forceCleanupUI, checkAndCleanupLoadingUI } from '@/utils/dom-cleanup';
import { ErrorDisplay } from '@/components/ui/error-display';

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

  // Clean up any stale loading UI on mount and unmount
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('QuickRecipePage mounted', { isLoading, isRetrying, error });
    }
    
    // Only clean up if we're not loading or retrying
    if (!isLoading && !isRetrying) {
      forceCleanupUI();
    }
    
    // Set up periodic checks for orphaned loading UI
    const cleanupInterval = setInterval(checkAndCleanupLoadingUI, 5000);
    
    return () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('QuickRecipePage unmounted');
      }
      clearInterval(cleanupInterval);
      
      // Only clean up if we're not loading or retrying
      // This prevents cleaning up when navigating while loading
      if (!isLoading && !isRetrying) {
        forceCleanupUI();
      }
    };
  }, [isLoading, isRetrying]);
  
  // REMOVED: Edge function error handling specifically
                              
  const renderErrorContent = () => {
    // Simplified error display without edge function specific handling
    return (
      <QuickRecipeError
        error={error}
        hasTimeoutError={hasTimeoutError}
        debugMode={debugMode}
        formData={formData}
        onCancel={handleCancel}
        onRetry={handleRetry}
        isRetrying={isRetrying}
      />
    );
  };

  return (
    <PageContainer>
      {/* Loading/Retrying Overlay */}
      {(isLoading || isRetrying) && (
        <FullScreenLoading
          onCancel={handleCancel}
          onRetry={error ? handleRetry : undefined}
          error={error}
        />
      )}
      
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <QuickRecipeHero
          hasRecipe={!!recipe}
          toggleDebugMode={toggleDebugMode}
          debugMode={debugMode}
        />

        {isDirectNavigation ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6">
            <QuickRecipeFormContainer />
          </div>
        ) : error ? (
          renderErrorContent()
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
