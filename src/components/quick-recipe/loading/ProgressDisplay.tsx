
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlarmClock } from 'lucide-react';
import { formatTimeRemaining } from './utils';

interface ProgressDisplayProps {
  percentComplete: number;
  timeRemaining: number;
  showFinalAnimation: boolean;
  showTimeout: boolean;
  stepDescription: string;
}

export function ProgressDisplay({ 
  percentComplete, 
  timeRemaining, 
  showFinalAnimation,
  showTimeout,
  stepDescription
}: ProgressDisplayProps) {
  return (
    <>
      {/* Progress indicator - Full width container */}
      <div className="w-full">
        <Progress 
          value={showFinalAnimation ? 100 : percentComplete} 
          className="h-2"
          indicatorClassName={showFinalAnimation ? "bg-recipe-green" : undefined}
        />
        <p className="text-xs mt-1 text-muted-foreground text-right">
          {showFinalAnimation ? "100% Complete" : formatTimeRemaining(timeRemaining)}
        </p>
      </div>
      
      {/* Timeout warning */}
      {showTimeout && !showFinalAnimation && (
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2 w-full">
          <AlarmClock className="h-4 w-4" />
          <span>This is taking longer than usual. Please be patient...</span>
        </div>
      )}
    </>
  );
}
