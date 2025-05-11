
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuickRecipeHero } from '@/components/quick-recipe/hero/QuickRecipeHero';
import { QuickRecipeFormContainer } from '@/components/quick-recipe/QuickRecipeFormContainer';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { QuickRecipeError } from '@/components/quick-recipe/error/QuickRecipeError';
import { QuickRecipeEmpty } from '@/components/quick-recipe/empty/QuickRecipeEmpty';
import { useQuickRecipePage } from '@/hooks/use-quick-recipe-page';
import { PageContainer } from '@/components/ui/containers';
import { useTransitionController } from '@/hooks/use-transition-controller';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { logTransition } from '@/utils/transition-debugger';

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
  
  // Use the transition controller for smoother page transitions
  const { isReady, setIsReady } = useTransitionController({
    initialReady: !isLoading && !isRetrying,
    debug: true
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set page as ready when data is available
  useEffect(() => {
    // If we're coming from loading page, delay being ready briefly to ensure animation
    if (location.state?.fromLoading) {
      logTransition('QuickRecipePage', 'Transitioning from loading page');
      const timeout = setTimeout(() => {
        setIsReady(true);
        logTransition('QuickRecipePage', 'Ready state set to true after loading transition');
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setIsReady(!isLoading && !isRetrying);
      logTransition('QuickRecipePage', `Ready state: ${!isLoading && !isRetrying}`);
    }
  }, [isLoading, isRetrying, location.state, setIsReady]);
  
  // If loading or retrying, redirect to the loading page with smooth transition
  useEffect(() => {
    if ((isLoading || isRetrying) && location.pathname !== '/loading') {
      logTransition('QuickRecipePage', "Redirecting to loading page due to loading state");
      
      // Navigate to loading page with necessary state
      navigate('/loading', { 
        state: { 
          fromQuickRecipePage: true,
          timestamp: Date.now()
        },
        replace: true // Use replace to avoid back button issues
      });
    }
  }, [isLoading, isRetrying, navigate, location.pathname]);
  
  // If loading is happening, don't render anything so we don't see a flash
  // Let the redirect to loading page handle it
  if (isLoading || isRetrying) {
    logTransition('QuickRecipePage', "Page in loading/retrying state, returning null");
    return null;
  }
  
  logTransition('QuickRecipePage', `Rendering with recipe: ${!!recipe}, error: ${!!error}`);
  
  return (
    <PageWrapper ready={isReady}>
      <PageContainer>
        <div className="space-y-10 py-6 md:py-10">
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
    </PageWrapper>
  );
};

export default QuickRecipePage;
