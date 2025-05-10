
import React from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { useAudioInteraction } from '@/hooks/use-audio-interaction';
import { useUserMessage } from './loading/utils';
import { LoadingAnimation } from './loading/LoadingAnimation';
import { TopLoadingBar } from './loading/TopLoadingBar';
import { AlertCircle } from 'lucide-react';

export function QuickRecipeLoading() {
  const { loadingState, formData, completedLoading } = useQuickRecipeStore();
  const { showTimeout, showFinalAnimation } = useLoadingProgress();
  useAudioInteraction(completedLoading);
  
  // Get personalized message
  const userMessage = useUserMessage(formData?.mainIngredient);
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[40vh] sm:min-h-[50vh] py-3 sm:py-5 px-2 sm:px-4 hw-accelerated">
      {/* Top loading bar that shows progress */}
      <TopLoadingBar 
        color="#4CAF50" 
        showFinalAnimation={showFinalAnimation} 
      />
      
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center w-full max-w-xs sm:max-w-md mx-auto p-2 sm:p-4">
        {/* Animated cooking pot icon or completion animation - hardware accelerated */}
        <div className="hw-accelerated">
          <LoadingAnimation showFinalAnimation={showFinalAnimation} />
        </div>
        
        {/* Personalized message with animation */}
        <h2 className="text-base sm:text-lg font-semibold animate-fade-in">
          {showFinalAnimation ? "Recipe ready!" : userMessage}
        </h2>
        
        {/* Step description with animation */}
        <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
          {showFinalAnimation ? "Your perfect recipe has been created." : loadingState.stepDescription}
        </p>
        
        {/* Enhanced progress indicator */}
        <div className="w-full h-2 sm:h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-recipe-green to-recipe-blue transition-all duration-300 ease-out rounded-full animate-progress-pulse"
            style={{ width: `${loadingState.percentComplete}%` }}
          />
        </div>
        
        {/* Timeout warning with mobile optimization */}
        {showTimeout && !showFinalAnimation && (
          <div className="flex items-center gap-1 sm:gap-2 text-amber-600 dark:text-amber-400 text-xs sm:text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-2 sm:px-3 rounded-lg mt-1 sm:mt-2 w-full animate-fade-in">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>This is taking longer than usual. Please be patient...</span>
          </div>
        )}
        
        {/* Smart tip card - Uses full width of parent container */}
        <div className="w-full animate-fade-in">
          <LoadingTipCard />
        </div>
      </div>
    </div>
  );
}
