
import React from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { useAudioInteraction } from '@/hooks/use-audio-interaction';
import { useUserMessage } from './loading/utils';
import { LoadingAnimation } from './loading/LoadingAnimation';
import { ProgressDisplay } from './loading/ProgressDisplay';

export function QuickRecipeLoading() {
  const { loadingState, formData, completedLoading } = useQuickRecipeStore();
  const { showTimeout, showFinalAnimation } = useLoadingProgress();
  useAudioInteraction(completedLoading);
  
  // Get personalized message
  const userMessage = useUserMessage(formData?.mainIngredient);
  
  return (
    <div className="flex flex-col items-center justify-center py-5 sm:py-8 w-full animate-fadeIn">
      <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center w-full max-w-md mx-auto">
        {/* Animated cooking pot icon or completion animation */}
        <LoadingAnimation showFinalAnimation={showFinalAnimation} />
        
        {/* Personalized message */}
        <h2 className="text-lg sm:text-xl font-semibold">
          {showFinalAnimation ? "Recipe ready!" : userMessage}
        </h2>
        
        {/* Step description */}
        <p className="text-sm text-muted-foreground">
          {showFinalAnimation ? "Your perfect recipe has been created." : loadingState.stepDescription}
        </p>
        
        {/* Progress indicator with timeout warning */}
        <ProgressDisplay 
          percentComplete={loadingState.percentComplete}
          timeRemaining={loadingState.estimatedTimeRemaining}
          showFinalAnimation={showFinalAnimation}
          showTimeout={showTimeout}
          stepDescription={loadingState.stepDescription}
        />
        
        {/* Smart tip card - Uses full width of parent container */}
        <div className="w-full animate-fade-in">
          <LoadingTipCard />
        </div>
      </div>
    </div>
  );
}
