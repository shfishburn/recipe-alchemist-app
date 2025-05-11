
import React from 'react';
import { ErrorState } from './loading/ErrorState';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { markActiveLoading, clearActiveLoading } from '@/utils/dom-cleanup';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export const FullScreenLoading = React.memo(function FullScreenLoading({ 
  onCancel, 
  onRetry, 
  error 
}: FullScreenLoadingProps) {
  const isErrorState = !!error;
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Mark and clear active loading state for DOM cleanup utility
  React.useEffect(() => {
    if (containerRef.current) {
      markActiveLoading(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        clearActiveLoading(containerRef.current);
      }
    };
  }, []);
  
  return (
    <LoadingOverlay
      onCancel={onCancel}
      isError={isErrorState}
    >
      <div ref={containerRef} id="fullscreen-loading-content">
        {isErrorState ? (
          <ErrorState 
            error={error}
            onCancel={onCancel}
            onRetry={onRetry}
          />
        ) : (
          <QuickRecipeLoading 
            onCancel={onCancel}
          />
        )}
      </div>
    </LoadingOverlay>
  );
});

export default FullScreenLoading;
