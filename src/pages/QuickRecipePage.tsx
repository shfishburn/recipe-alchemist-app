
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuickRecipeHero } from '@/components/quick-recipe/hero/QuickRecipeHero';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { QuickRecipeError } from '@/components/quick-recipe/error/QuickRecipeError';
import { useQuickRecipePage } from '@/hooks/use-quick-recipe-page';
import { PageContainer } from '@/components/ui/containers';
import { Button } from '@/components/ui/button';
import { useRecipeDataRecovery } from '@/hooks/use-recipe-data-recovery';

const QuickRecipePage: React.FC = () => {
  const {
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
  
  const navigate = useNavigate();
  const location = useLocation();
  const { getRecipeIdFromUrl } = useRecipeDataRecovery();
  
  // If loading or retrying, redirect to the loading page to prevent flicker
  useEffect(() => {
    if ((isLoading || isRetrying) && location.pathname !== '/loading') {
      console.log("Redirecting to loading page from QuickRecipePage due to loading state");
      
      // Navigate to loading page with necessary state
      navigate('/loading', { 
        state: { 
          fromQuickRecipePage: true,
          timestamp: Date.now()
        }
      });
    }
  }, [isLoading, isRetrying, navigate, location.pathname]);
  
  // Log state for debugging
  useEffect(() => {
    console.log("QuickRecipePage - Current state:", { 
      hasError: !!error, 
      isLoading, 
      error, 
      isDirectNavigation,
    });
  }, [isLoading, error, isDirectNavigation]);
  
  // If loading is happening, don't render anything so we don't see a flash
  // Let the redirect to loading page handle it
  if (isLoading || isRetrying) {
    return null;
  }
  
  // Go to view recipe if we have a stored recipe
  const handleViewExistingRecipe = () => {
    // If we can find a recipe ID in the store or URL, use it in the navigation
    const recipeId = getRecipeIdFromUrl();
    if (recipeId) {
      navigate(`/recipe-preview/${recipeId}`);
    } else {
      navigate('/recipe-preview');
    }
  };
  
  return (
    <PageContainer>
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <QuickRecipeHero
          hasRecipe={false}
          toggleDebugMode={toggleDebugMode}
          debugMode={debugMode}
        />

        {error ? (
          <QuickRecipeError
            error={error}
            hasTimeoutError={hasTimeoutError}
            debugMode={debugMode}
            formData={formData}
            onCancel={handleCancel}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
        ) : (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6">
            {/* If we have a form submission in progress, show button to view recipe */}
            {formData && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">You have a recipe ready to view</h3>
                    <p className="text-sm text-gray-500">You can view your generated recipe or start a new one.</p>
                  </div>
                  <Button 
                    onClick={handleViewExistingRecipe}
                    className="bg-recipe-green hover:bg-recipe-green/90"
                  >
                    View Recipe
                  </Button>
                </div>
              </div>
            )}
            <QuickRecipeFormContainer />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default QuickRecipePage;
