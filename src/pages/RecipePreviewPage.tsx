
import React, { useState } from 'react';
import { QuickRecipeDisplay } from '@/components/quick-recipe/QuickRecipeDisplay';
import { QuickRecipeRegeneration } from '@/components/quick-recipe/QuickRecipeRegeneration';
import { PageContainer } from '@/components/ui/containers';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { PreviewHeader } from '@/components/quick-recipe/preview/PreviewHeader';
import { useRecipePreview } from '@/hooks/use-recipe-preview';
import { useRecipeSaveHandler } from '@/hooks/use-recipe-save-handler';

const RecipePreviewPage: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);
  
  // Use our custom hooks to manage recipe preview logic and saving
  const {
    recipe,
    formData,
    isLoading,
    handleRetry,
    isResuming,
    hasPendingSave,
  } = useRecipePreview();
  
  const {
    isSaving,
    isSavingRecipe,
    saveSuccess,
    resetSaveSuccess,
    savedSlug,
    handleSaveRecipe
  } = useRecipeSaveHandler(recipe, isResuming, hasPendingSave);
  
  // Toggle debug mode function
  const toggleDebugMode = () => setDebugMode(prev => !prev);
  
  // If no recipe, show nothing (will redirect in useEffect inside the hook)
  if (!recipe) {
    return null;
  }
  
  // Determine if we should show loading overlay (either store saving state or local saving state)
  const showLoadingOverlay = isSavingRecipe || isSaving;
  
  return (
    <PageContainer>
      {showLoadingOverlay && (
        <LoadingOverlay isOpen={showLoadingOverlay}>
          <div className="p-6 flex flex-col items-center gap-4 text-center">
            <h3 className="text-lg font-semibold">Saving your recipe...</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we save your delicious creation.
            </p>
          </div>
        </LoadingOverlay>
      )}
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <PreviewHeader toggleDebugMode={toggleDebugMode} />
      
        <div className="space-y-8">
          <QuickRecipeDisplay 
            recipe={recipe} 
            onSave={handleSaveRecipe}
            isSaving={showLoadingOverlay}
            saveSuccess={saveSuccess}
            debugMode={debugMode}
            onResetSaveSuccess={resetSaveSuccess}
            savedSlug={savedSlug}
          />
          <QuickRecipeRegeneration 
            formData={formData} 
            isLoading={isLoading} 
            onRetry={handleRetry} 
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default RecipePreviewPage;
