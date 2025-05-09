
import React from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { useAudioInteraction } from '@/hooks/use-audio-interaction';
import { useUserMessage } from './loading/utils';
import { LoadingAnimation } from './loading/LoadingAnimation';
import { ClockProgress } from './loading/ClockProgress';
import { AlertCircle } from 'lucide-react';

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
        
        {/* Personalized message with animation */}
        <h2 className="text-lg sm:text-xl font-semibold animate-fade-in">
          {showFinalAnimation ? "Recipe ready!" : userMessage}
        </h2>
        
        {/* Step description with animation */}
        <p className="text-sm text-muted-foreground animate-pulse">
          {showFinalAnimation ? "Your perfect recipe has been created." : loadingState.stepDescription}
        </p>
        
        {/* Replace progress indicator with clock */}
        <div className="w-full flex justify-center my-4">
          <ClockProgress
            percentComplete={loadingState.percentComplete}
            showTimeout={showTimeout && !showFinalAnimation}
          />
        </div>
        
        {/* Timeout warning */}
        {showTimeout && !showFinalAnimation && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2 w-full animate-fade-in">
            <AlertCircle className="h-4 w-4" />
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
