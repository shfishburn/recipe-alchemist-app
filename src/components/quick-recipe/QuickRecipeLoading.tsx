import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle } from 'lucide-react';
import '@/styles/loading.css';

interface QuickRecipeLoadingProps {
  onCancel?: () => void;
  timeoutWarning?: boolean;
  percentComplete: number;
  stepDescription: string;
}

export function QuickRecipeLoading({ onCancel, timeoutWarning = false, percentComplete, stepDescription }: QuickRecipeLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-hidden">
      <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-6 w-full">
        {/* Gift box icon with animations */}
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
        
        {/* Main heading */}
        <h2 className="text-xl font-semibold animate-fade-in">
          Creating your recipe...
        </h2>
        <p className="text-sm text-gray-500 animate-fade-in">{stepDescription}</p>
        
        {/* Progress bar with animation */}
        <Progress
          value={percentComplete}
          className="w-full animate-fade-in"
          indicatorClassName="animate-progress-pulse"
          indicatorColor="#4CAF50"
        />
        <span className="text-sm mt-1 text-gray-500 animate-fade-in">{percentComplete}%</span>
        
        {/* Timeout warning - conditionally rendered */}
        {timeoutWarning && (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-900/10 py-2 px-3 rounded-lg w-full">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>This is taking longer than usual. Please be patient...</span>
          </div>
        )}
        
        {/* Tip card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 w-full">
          <h4 className="text-base font-semibold mb-2">Chef's Tip</h4>
          <p className="text-sm text-muted-foreground">
            Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
          </p>
        </div>
        
        {/* Cancel button */}
        <Button 
          variant="ghost" 
          onClick={onCancel} 
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
