
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import LoadingOverlay from '@/components/ui/loading-overlay';

interface LoadingInterstitialProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCancel?: () => void;
}

const LoadingInterstitial: React.FC<LoadingInterstitialProps> = ({
  isOpen,
  title = 'Creating your recipe...',
  description = 'This might take a moment as we craft your perfect recipe.',
  onCancel
}) => {
  return (
    <LoadingOverlay isOpen={isOpen}>
      <div className="p-6 flex flex-col items-center gap-4 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {description}
        </p>
        {onCancel && (
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              This process usually takes 15-30 seconds
            </span>
          </div>
        )}
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="mt-2"
          >
            Cancel
          </Button>
        )}
      </div>
    </LoadingOverlay>
  );
};

export default LoadingInterstitial;
