
import React from 'react';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
  isRetrying?: boolean;
}

export function FullScreenLoading({ 
  onCancel, 
  onRetry, 
  error, 
  isRetrying = false 
}: FullScreenLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-white/90 dark:bg-background/90 p-6 rounded-lg shadow-lg sm:p-8 md:p-10 w-full max-w-md">
        {/* QuickRecipeLoading already has cancel button built-in */}
        <QuickRecipeLoading />
        
        {/* Display error message if any */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-red-700 dark:text-red-300">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex items-center justify-center"
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
          
          {error && onRetry && (
            <Button 
              variant="default" 
              onClick={onRetry} 
              disabled={isRetrying}
              className={cn(
                "flex items-center justify-center",
                isRetrying ? "animate-pulse" : ""
              )}
              size="sm"
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", isRetrying ? "animate-spin" : "")} />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
