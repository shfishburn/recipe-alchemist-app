
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
  isRetrying?: boolean;
}

export function FullScreenLoading({ onCancel, onRetry, error, isRetrying = false }: FullScreenLoadingProps) {
  // Simplified component with no dependencies on complex hooks or CSS modules
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-background/95 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md p-6 m-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 animate-fade-in">
        {error ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold">Recipe Generation Failed</h2>
            <p className="text-muted-foreground">{error}</p>
            
            <div className="flex flex-row gap-3 pt-2">
              {onCancel && (
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex items-center gap-2"
                  disabled={isRetrying}
                >
                  <XCircle className="h-4 w-4" />
                  Start Over
                </Button>
              )}
              
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  className="flex items-center gap-2"
                  disabled={isRetrying}
                >
                  <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Try Again'}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
              <svg 
                width="80" 
                height="80" 
                viewBox="0 0 80 80" 
                className="animate-pulse"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M60 33.33H20V60C20 62.76 22.24 65 25 65H55C57.76 65 60 62.76 60 60V33.33Z" fill="#D1D5DB" />
                <path d="M55 33.33H25C22.24 33.33 20 31.09 20 28.33C20 25.57 22.24 23.33 25 23.33H55C57.76 23.33 60 25.57 60 28.33C60 31.09 57.76 33.33 55 33.33Z" fill="#4CAF50" />
                <path d="M40 23.33C40 17.81 35.52 13.33 30 13.33C24.48 13.33 20 17.81 20 23.33" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
                <path d="M40 23.33C40 17.81 44.48 13.33 50 13.33C55.52 13.33 60 17.81 60 23.33" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
              </svg>
              
              {/* Simple animated elements instead of complex steam animations */}
              <div className="absolute -top-2 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-75 delay-75" />
              <div className="absolute -top-3 left-1/2 w-2 h-2 bg-white rounded-full animate-ping opacity-75 delay-150" />
              <div className="absolute -top-4 left-3/4 w-2 h-2 bg-white rounded-full animate-ping opacity-75 delay-300" />
            </div>
            
            <h2 className="text-lg font-semibold">Creating your recipe...</h2>
            
            {/* Simple progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-recipe-green h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
            
            {/* Tip card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 w-full">
              <h4 className="text-base font-semibold mb-2">Chef's Tip</h4>
              <p className="text-sm text-muted-foreground">
                Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
              </p>
            </div>
            
            {/* Cancel button */}
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FullScreenLoading;
