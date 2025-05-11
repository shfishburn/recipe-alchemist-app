
import React from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserMessage } from '@/hooks/use-user-message';
import { RecipeLoadingAnimation } from './loading/RecipeLoadingAnimation';
import styles from '@/styles/loading.module.css';

// Import loading steps to use as fallback
import { LOADING_STEPS } from '@/hooks/use-loading-progress';

interface QuickRecipeLoadingProps {
  onCancel?: () => void;
}

export function QuickRecipeLoading({ onCancel }: QuickRecipeLoadingProps) {
  const { loadingState, formData } = useQuickRecipeStore();
  const { showTimeout, showFinalAnimation, cleanup } = useLoadingProgress();
  
  // Get personalized message based on the main ingredient
  const userMessage = useUserMessage(formData?.mainIngredient);
  
  // Handler for cancel button
  const handleCancel = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Cancel clicked');
    }
    cleanup();
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-6 w-full">
      {/* Top progress bar that shows loading progress */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-50"
        role="progressbar" 
        aria-label="Loading progress"
        aria-valuemin={0} 
        aria-valuemax={100}
        aria-valuenow={showFinalAnimation ? 100 : loadingState.percentComplete}
      >
        <div 
          className={`h-full bg-recipe-green transition-all duration-300 ease-out min-w-[5%]`}
          style={{ 
            boxShadow: `0 0 8px rgba(76, 175, 80, 0.5)`,
            width: showFinalAnimation ? '100%' : `${loadingState.percentComplete || 5}%`
          }}
        />
      </div>
      
      {/* Chef hat animation always shows regardless of state */}
      <div className="relative h-24 w-24" aria-hidden="true">
        <RecipeLoadingAnimation />
      </div>
      
      {/* Personalized message with animation */}
      <h2 className={`text-lg font-semibold ${styles.fadeIn}`}>
        {showFinalAnimation 
          ? "Recipe ready!" 
          : userMessage || "Creating your recipe..."}
      </h2>
      
      {/* Step description with animation */}
      <div aria-live="polite">
        <p className="text-sm text-muted-foreground animate-pulse">
          {showFinalAnimation 
            ? "Your perfect recipe has been created." 
            : loadingState.stepDescription || LOADING_STEPS[0]}
        </p>
      </div>
      
      {/* Enhanced progress indicator */}
      <div 
        className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-label="Loading progress indicator"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={loadingState.percentComplete}
        aria-hidden="true"
      >
        <div 
          className={`h-full bg-gradient-to-r from-recipe-green to-recipe-blue transition-all duration-300 ease-out rounded-full ${styles.animateProgressPulse} min-w-[5%]`}
          style={{ width: `${loadingState.percentComplete || 5}%` }}
        />
      </div>
      
      {/* Timeout warning - conditionally rendered */}
      {showTimeout && !showFinalAnimation && (
        <div className={`flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg w-full ${styles.fadeIn}`}>
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>This is taking longer than usual. Please be patient...</span>
        </div>
      )}
      
      {/* Tip card */}
      <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 w-full ${styles.fadeIn}`}>
        <h4 className="text-base font-semibold mb-2">Chef's Tip</h4>
        <p className="text-sm text-muted-foreground">
          {showFinalAnimation
            ? "Your recipe is ready! Enjoy cooking your personalized dish."
            : "Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now."}
        </p>
      </div>
      
      {/* Cancel button */}
      <Button 
        variant="ghost" 
        onClick={handleCancel} 
        className={`text-muted-foreground hover:text-foreground ${styles.fadeIn}`}
      >
        Cancel
      </Button>
    </div>
  );
}
