
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
  // Clean, simplified component with no header
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-white"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-md p-4 sm:p-6 flex flex-col items-center">
        {error ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold">Recipe Generation Failed</h2>
            <p className="text-muted-foreground">{error}</p>
            
            <div className="flex flex-row gap-3 pt-4">
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
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Simple gift box icon - similar to what's shown in screenshot */}
            <div className="relative">
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
                <path d="M60 45V30M50 37.5C50 32.8 54.5 25 60 30c5.5 5 10 2.5 10 7.5S65.5 45 60 45s-10-2.8-10-7.5z" stroke="#4CAF50" strokeWidth="4" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold">Creating your recipe...</h2>
            
            {/* Simple progress bar - similar to what's in screenshot */}
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="bg-recipe-green h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            {/* Tip card - styled to match screenshot */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 w-full">
              <h4 className="text-lg font-semibold mb-2">Chef's Tip</h4>
              <p className="text-gray-600">
                Patience is key in cooking. The best flavors take time to develop, just like your recipe is taking shape now.
              </p>
            </div>
            
            {/* Cancel button - styled to match screenshot */}
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel} 
                className="text-gray-500"
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
