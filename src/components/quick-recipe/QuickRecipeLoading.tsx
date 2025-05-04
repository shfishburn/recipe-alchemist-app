
import React from 'react';
import { LoadingAnimation } from './loading/LoadingAnimation';
import { LoadingProgress } from './loading/LoadingProgress';
import { TimeoutWarning } from './loading/TimeoutWarning';
import { LoadingTipCard } from './loading/LoadingTipCard';
import { LoadingContainer } from './loading/LoadingContainer';
import { LoadingMessage } from './loading/LoadingMessage';
import { useLoadingAnimation } from '@/hooks/use-loading-animation';

export function QuickRecipeLoading() {
  // Use our custom hook for managing loading state and animations
  const { loadingState, showFinalAnimation, showTimeout, personalizedMessage } = useLoadingAnimation();
  
  return (
    <LoadingContainer>
      {/* Animated cooking pot icon or completion animation */}
      <div className="relative">
        <LoadingAnimation showFinalAnimation={showFinalAnimation} />
      </div>
      
      {/* Messages */}
      <LoadingMessage
        showFinalAnimation={showFinalAnimation}
        personalizedMessage={personalizedMessage}
        stepDescription={loadingState.stepDescription}
      />
      
      {/* Progress indicator */}
      <LoadingProgress 
        showFinalAnimation={showFinalAnimation}
        percentComplete={loadingState.percentComplete}
        estimatedTimeRemaining={loadingState.estimatedTimeRemaining}
      />
      
      {/* Timeout warning */}
      <TimeoutWarning 
        showTimeout={showTimeout} 
        showFinalAnimation={showFinalAnimation} 
      />
      
      {/* Smart tip card */}
      <div className="w-full max-w-xs animate-fade-in">
        <LoadingTipCard />
      </div>
    </LoadingContainer>
  );
}
