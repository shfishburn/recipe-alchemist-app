
import React from 'react';
import { ErrorState } from './loading/ErrorState';
import { QuickRecipeLoading } from './QuickRecipeLoading';

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
  
  // Debug logs to track component renders
  console.log("FullScreenLoading rendered", { error, isErrorState });
  
  return (
    <div 
      className="loading-overlay fixed inset-0 flex flex-col items-center justify-center p-4 z-[9999] animate-fadeIn touch-action-none"
      style={{ 
        backgroundColor: isErrorState ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.95)',
      }}
      aria-modal="true"
      role="dialog"
      id="fullscreen-loading-overlay"
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-12">
        {isErrorState ? (
          <ErrorState 
            error={error}
            onCancel={onCancel}
            onRetry={onRetry}
          />
        ) : (
          <QuickRecipeLoading />
        )}
      </div>
    </div>
  );
});

export default FullScreenLoading;
