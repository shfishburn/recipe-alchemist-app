
import React from 'react';
import { QuickRecipeHero } from '@/components/quick-recipe/hero/QuickRecipeHero';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { QuickRecipeError } from '@/components/quick-recipe/error/QuickRecipeError';
import { QuickRecipeEmpty } from '@/components/quick-recipe/empty/QuickRecipeEmpty';
import { FullScreenLoading } from '@/components/quick-recipe/FullScreenLoading';
import { useQuickRecipePage } from '@/hooks/use-quick-recipe-page';
import { PageContainer } from '@/components/ui/containers';

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
                            
  const renderErrorContent = () => {
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
    <>
      {/* Simplified Loading/Retrying Overlay */}
      {(isLoading || isRetrying) && (
        <FullScreenLoading
          key="loading-overlay"
          onCancel={handleCancel}
          onRetry={error ? handleRetry : undefined}
          error={error}
          isRetrying={isRetrying}
        />
      )}
      
      <PageContainer>
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
    </>
  );
};

export default QuickRecipePage;
