
import React, { useEffect } from 'react';
import { ErrorState } from './loading/ErrorState';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { useKeyPress } from '@/hooks/use-key-press';

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
  
  // Handle Escape key press
  useKeyPress('Escape', () => {
    if (onCancel) {
      console.log('Escape pressed, cancelling loading');
      onCancel();
    }
  });

  // Focus trap implementation
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Focus the container on mount
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    // Store previous active element to restore focus on unmount
    const previousActiveElement = document.activeElement as HTMLElement;
    
    return () => {
      // Restore focus on unmount
      if (previousActiveElement && 'focus' in previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, []);
  
  return (
    <div 
      className="loading-overlay fixed inset-0 flex flex-col items-center justify-center p-4 z-50"
      style={{ 
        backgroundColor: isErrorState ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.95)',
      }}
      aria-modal="true"
      role="dialog"
      aria-busy="true"
      aria-live="polite"
      id="fullscreen-loading-overlay"
      ref={containerRef}
      tabIndex={-1} // Make focusable for focus trap
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-6 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
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
    </div>
  );
});

export default FullScreenLoading;
