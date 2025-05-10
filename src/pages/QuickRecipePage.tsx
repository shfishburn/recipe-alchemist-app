
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
import { forceCleanupUI } from '@/utils/dom-cleanup';

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
    
    // Only clean up previous loading states if we're not currently loading
    if (!isLoading && !isRetrying) {
      forceCleanupUI();
    }
    
    return () => {
      console.log('QuickRecipePage unmounted');
      
      // Clean up body classes
      document.body.classList.remove('overflow-hidden');
      document.body.style.position = '';
      document.body.style.width = '';
      
      // Show navbar if it was hidden
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = '';
      }
      
      // Run additional cleanup
      forceCleanupUI();
    };
  }, []);

  // Log state changes and manage body overflow
  useEffect(() => {
    console.log('QuickRecipePage state change', { 
      isLoading, 
      isRetrying, 
      hasRecipe: !!recipe, 
      hasError: !!error 
    });
    
    // Apply or remove overflow handling when loading state changes
    if (isLoading || isRetrying) {
      document.body.classList.add('overflow-hidden');
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Hide navbar during loading
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = 'none';
      }
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.style.position = '';
      document.body.style.width = '';
      
      // Show navbar again
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.display = '';
      }
    }
  }, [isLoading, isRetrying, recipe, error]);

  // Full-screen loading while generating or retrying
  if (isLoading || isRetrying) {
    console.log('Rendering loading state in QuickRecipePage', { isLoading, isRetrying });
    return (
      <div className="h-screen w-screen fixed top-0 left-0 z-[9999] bg-white dark:bg-gray-950">
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
