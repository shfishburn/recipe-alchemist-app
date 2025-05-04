
import React from 'react';
import { AlarmClock } from 'lucide-react';

interface TimeoutWarningProps {
  showTimeout: boolean;
  showFinalAnimation: boolean;
}

export function TimeoutWarning({ showTimeout, showFinalAnimation }: TimeoutWarningProps) {
  if (!showTimeout || showFinalAnimation) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg mt-2">
      <AlarmClock className="h-4 w-4" />
      <span>This is taking longer than usual. Please be patient...</span>
    </div>
  );
}
