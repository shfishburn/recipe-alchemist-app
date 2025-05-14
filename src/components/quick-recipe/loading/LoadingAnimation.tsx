
import React from 'react';
import { MaterialLoadingAnimation } from './MaterialLoadingAnimation';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  step: number;
  stepDescription: string;
  percentComplete: number;
  estimatedTimeRemaining?: number;
}

export function LoadingAnimation({ 
  step, 
  stepDescription, 
  percentComplete,
  estimatedTimeRemaining 
}: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      <MaterialLoadingAnimation 
        progress={percentComplete} 
        showChefTip={true}
        estimatedTimeRemaining={estimatedTimeRemaining}
        timeoutWarning={percentComplete > 85 && step >= 2} // Show timeout warning in later stages if taking long
      />
      
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-xl font-semibold tracking-tight">{stepDescription}</h2>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {percentComplete < 50 ? 'This may take a minute...' : 'Almost there...'}
        </p>
      </div>
    </div>
  );
}

export default LoadingAnimation;
