
import React from 'react';
import { AlarmClock } from 'lucide-react';
import { formatTimeRemaining } from './utils';
import { ClockProgress } from './ClockProgress';

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
      {/* Clock Progress component replaces the traditional progress bar */}
      <div className="w-full flex justify-center">
        <ClockProgress 
          percentComplete={showFinalAnimation ? 100 : percentComplete}
          showTimeout={showTimeout && !showFinalAnimation}
        />
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
