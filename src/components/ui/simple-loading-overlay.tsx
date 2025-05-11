
import React, { useEffect, useRef } from 'react';
import { SimpleLoadingSpinner } from './simple-loading-spinner';
import { SimpleErrorDisplay } from './simple-error-display';
import { useKeyPress } from '@/hooks/use-key-press';

interface SimpleLoadingOverlayProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  message?: string;
}

export function SimpleLoadingOverlay({
  isLoading,
  error,
  onRetry,
  onCancel,
  message = "Creating your recipe..."
}: SimpleLoadingOverlayProps) {
  // Handle escape key press
  useKeyPress('Escape', () => {
    if (onCancel && (isLoading || error)) {
      onCancel();
    }
  });
  
  // Trap focus when overlay is active
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (isLoading || error) {
      // Save current focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the overlay
      if (overlayRef.current) {
        overlayRef.current.focus();
      }
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      
      // Restore on cleanup
      return () => {
        document.body.style.overflow = '';
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isLoading, error]);
  
  // Don't render if not needed
  if (!isLoading && !error) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[9999] p-4 simple-loading-overlay"
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-busy={isLoading}
      aria-live={error ? "assertive" : "polite"}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 flex flex-col items-center">
        {isLoading && !error ? (
          <>
            <SimpleLoadingSpinner size="lg" />
            <p className="mt-4 text-lg font-medium text-center">{message}</p>
            
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel}
                className="mt-6"
              >
                Cancel
              </Button>
            )}
          </>
        ) : (
          <SimpleErrorDisplay
            error={error}
            onRetry={onRetry}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
}
