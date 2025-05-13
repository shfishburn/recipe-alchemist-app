
import React from 'react';
import { RecipeLoadingAnimation } from './RecipeLoadingAnimation';

interface LoadingAnimationProps {
  step: number;
  stepDescription: string;
  percentComplete: number;
}

export function LoadingAnimation({ step, stepDescription, percentComplete }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      <RecipeLoadingAnimation progress={percentComplete} showChefTip={true} />
      
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-xl font-semibold tracking-tight">{stepDescription}</h2>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-gradient-to-r from-recipe-blue to-recipe-green h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
            role="progressbar" 
            aria-valuenow={percentComplete} 
            aria-valuemin={0} 
            aria-valuemax={100}
          />
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {percentComplete < 50 ? 'This may take a minute...' : 'Almost there...'}
        </p>
      </div>
    </div>
  );
}

export default LoadingAnimation;
