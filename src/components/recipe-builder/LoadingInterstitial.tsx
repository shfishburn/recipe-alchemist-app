
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';
import LoadingOverlay from '@/components/ui/loading-overlay';

interface LoadingInterstitialProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

const LoadingInterstitial: React.FC<LoadingInterstitialProps> = ({
  isOpen,
  title = 'Creating your recipe...',
  description = 'This might take a moment as we craft your perfect recipe.',
  onCancel,
  onRetry,
  error = null
}) => {
  // Show error state if there's an error and a retry function
  const showErrorState = !!error && !!onRetry;

  return (
    <LoadingOverlay isOpen={isOpen}>
      <div className="p-6 flex flex-col items-center gap-4 text-center">
        <h3 className="text-lg font-semibold">
          {showErrorState ? 'Something went wrong' : title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {showErrorState ? error : description}
        </p>
        
        {!showErrorState && onCancel && (
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              This process usually takes 15-30 seconds
            </span>
          </div>
        )}
        
        <div className="flex gap-3 mt-2">
          {showErrorState && onRetry && (
            <Button 
              onClick={onRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          )}
          
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default LoadingInterstitial;
