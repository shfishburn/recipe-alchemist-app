
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
    
    const loadingTrigger = document.createElement('div');
    loadingTrigger.className = 'loading-trigger';
    loadingTrigger.dataset.page = 'quick-recipe';
    document.body.appendChild(loadingTrigger);
    
    // Force cleanup any previous loading states when component mounts
    // But respect current loading state if active
    if (!isLoading && !isRetrying) {
      forceCleanupUI({ respectActiveLoading: true });
    }
    
    return () => {
      console.log('QuickRecipePage unmounted');
      
      // Clean up body classes and loading triggers
      document.body.classList.remove('overflow-hidden');
      document.body.style.position = '';
      document.body.style.width = '';
      
      // Remove loading trigger element
      if (loadingTrigger.parentNode) {
        document.body.removeChild(loadingTrigger);
      }
      
      // Run additional cleanup but respect any active loading that might be happening elsewhere
      forceCleanupUI({ respectActiveLoading: true });
    };
  }, []);

  // Log state changes to help with debugging
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
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isLoading, isRetrying, recipe, error]);

  // Full-screen loading while generating or retrying
  if (isLoading || isRetrying) {
    console.log('Rendering loading state in QuickRecipePage', { isLoading, isRetrying });
    return (
      <PageContainer className="relative touch-action-auto overflow-hidden">
        <LoadingIndicator />
        <FullScreenLoading
          onCancel={handleCancel}
          onRetry={error ? handleRetry : undefined}
          error={error}
        />
      </PageContainer>
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
