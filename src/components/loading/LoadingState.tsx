
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LoadingStateProps {
  progress: number;
  showTimeoutMessage: boolean;
  onCancel: () => void;
}

export function LoadingState({ progress, showTimeoutMessage, onCancel }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      {/* Gift box SVG icon */}
      <div className="relative animate-gift-bounce">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="30" y="45" width="60" height="60" rx="4" fill="#D1D5DB" />
          <path d="M30 49a4 4 0 014-4h52a4 4 0 014 4v10H30V49z" fill="#4CAF50" />
          <path d="M60 45V30M50 37.5C50 32.8 54.5 25 60 30c5.5 5 10 2.5 10 7.5S65 45 60 45s-10-2.8-10-7.5z" stroke="#4CAF50" strokeWidth="3" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-semibold">Creating your recipe...</h2>
      
      {/* Progress bar with animation */}
      <Progress 
        value={progress}
        className="w-full" 
        indicatorClassName="animate-progress-pulse" 
        indicatorColor="#4CAF50" 
      />
      
      {/* Timeout warning */}
      {showTimeoutMessage && (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800 p-4 w-full">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h4 className="text-base font-medium text-amber-700 dark:text-amber-400">Taking longer than expected</h4>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
            The recipe is taking a bit longer to create. Please be patient as our AI is working hard on your request.
          </p>
        </div>
      )}
      
      {/* Tip card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 w-full">
        <h4 className="text-lg font-semibold mb-2">Chef's Tip</h4>
        <p className="text-gray-600 dark:text-gray-300">
          Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
        </p>
      </div>
      
      {/* Cancel button */}
      <Button 
        variant="ghost" 
        onClick={onCancel} 
        className="text-gray-500"
      >
        Cancel
      </Button>
    </div>
  );
}
