
import React from 'react';

interface LoadingAnimationProps {
  step: number;
  stepDescription: string;
  percentComplete: number;
}

export function LoadingAnimation({ step, stepDescription, percentComplete }: LoadingAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      {/* Gift box animation */}
      <div className="relative animate-gift-float hw-accelerated" aria-hidden="true">
        <svg 
          width="100" 
          height="100" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="animate-gift-glow"
        >
          <rect x="25" y="37.5" width="50" height="50" rx="4" fill="#D1D5DB" />
          <path d="M25 41.5a4 4 0 014-4h42a4 4 0 014 4v8H25v-8z" fill="#4CAF50" />
          <path d="M50 37.5V25M41.6 31.25C41.6 27.33 45.5 20.83 50 25c4.5 4.17 8.3 2.08 8.3 6.25 0 4.17-4.16 6.25-8.3 6.25-4.16 0-8.4-2.33-8.4-6.25z" stroke="#4CAF50" strokeWidth="3" />
        </svg>
      </div>
      
      {/* Loading text and progress bar */}
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-xl font-semibold tracking-tight">{stepDescription}</h2>
        
        {/* Single progress bar with animation */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-recipe-green to-recipe-green h-2.5 rounded-full animate-progress-pulse transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
            role="progressbar" 
            aria-valuenow={percentComplete} 
            aria-valuemin={0} 
            aria-valuemax={100}
          />
        </div>
        
        <p className="text-sm text-gray-500">
          {percentComplete < 50 ? 'This may take a minute...' : 'Almost there...'}
        </p>
      </div>
    </div>
  );
}

export default LoadingAnimation;
