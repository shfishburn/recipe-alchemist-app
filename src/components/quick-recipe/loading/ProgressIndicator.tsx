
import React from 'react';

interface ProgressIndicatorProps {
  loadingState: {
    percentComplete: number;
    stepDescription: string;
    isStalled?: boolean;
  };
  showTimeout: boolean;
  showFinalAnimation: boolean;
}

export function ProgressIndicator({ 
  loadingState, 
  showTimeout, 
  showFinalAnimation 
}: ProgressIndicatorProps) {
  // Calculate width based on progress state
  const progressWidth = showFinalAnimation ? '100%' : `${loadingState.percentComplete}%`;
  
  return (
    <div className="w-full space-y-2">
      {/* Step description */}
      <p className="text-sm text-muted-foreground">
        {showFinalAnimation ? "Your recipe is ready!" : loadingState.stepDescription}
      </p>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-recipe-green transition-all duration-300 ease-out rounded-full"
          style={{ 
            width: progressWidth,
            animation: loadingState.isStalled ? 'none' : 'progress-pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
}
