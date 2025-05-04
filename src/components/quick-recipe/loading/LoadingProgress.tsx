
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface LoadingProgressProps {
  showFinalAnimation: boolean;
  percentComplete: number;
  estimatedTimeRemaining: number;
}

export function LoadingProgress({ 
  showFinalAnimation,
  percentComplete,
  estimatedTimeRemaining
}: LoadingProgressProps) {
  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Recipe ready!";
    if (seconds < 10) return `${Math.ceil(seconds)} seconds left`;
    return `About ${Math.ceil(seconds)} seconds`;
  };
  
  return (
    <div className="w-full max-w-xs">
      <Progress 
        value={showFinalAnimation ? 100 : percentComplete} 
        className="h-2"
        indicatorClassName={showFinalAnimation ? "bg-recipe-green" : undefined}
      />
      <p className="text-xs mt-1 text-muted-foreground text-right">
        {showFinalAnimation ? "100% Complete" : formatTimeRemaining(estimatedTimeRemaining)}
      </p>
    </div>
  );
}
