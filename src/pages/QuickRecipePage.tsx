import React, { useEffect } from 'react';
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
import { PageContainer, ContentContainer } from '@/components/ui/containers';

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
  
  console.log("QuickRecipePage - Current state:", { 
    isLoading, 
    recipe: !!recipe, 
    error, 
    formData: !!formData, 
    isDirectNavigation
  });

  // Force show loading indicator for navigation
  useEffect(() => {
    // This will trigger a re-render that loads the indicator
    const loadingTrigger = document.createElement('div');
    loadingTrigger.className = 'loading-trigger';
    document.body.appendChild(loadingTrigger);
    
    return () => {
      // Ensure we clean up any loading states when component unmounts
      document.body.classList.remove('overflow-hidden');
      if (loadingTrigger && loadingTrigger.parentNode) {
        document.body.removeChild(loadingTrigger);
      }
    };
  }, []);

  // Show full-screen loading when generating a recipe, within the relative container
  if (isLoading || isRetrying) {
    console.log("Showing loading screen for recipe generation");
    return (
      <PageContainer className="relative touch-action-auto">
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
      <Navbar />
      <LoadingIndicator />
      <main className="flex-1 py-6 md:py-10 animate-fadeIn">
        <ContentContainer>
          {/* Hero Title Section - Always show this */}
          <QuickRecipeHero 
            hasRecipe={!!recipe} 
            toggleDebugMode={toggleDebugMode}
            debugMode={debugMode}
          />

          {isDirectNavigation ? (
            // Show form directly when navigating from navbar
            <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md mb-10">
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
            <div className="space-y-8">
              <QuickRecipeDisplay recipe={recipe} />
              <QuickRecipeRegeneration formData={formData} isLoading={isLoading} />
            </div>
          ) : (
            // Show empty state
            <QuickRecipeEmpty />
          )}
        </ContentContainer>
      </main>
    </PageContainer>
  );
};

export default QuickRecipePage;
