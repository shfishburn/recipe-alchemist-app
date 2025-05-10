
import React, { useEffect, useRef } from 'react';
import { ErrorState } from './loading/ErrorState';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { useKeyPress } from '@/hooks/use-key-press';
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle Escape key press
  useKeyPress('Escape', () => {
    if (onCancel) {
      console.log('Escape pressed, cancelling loading');
      onCancel();
    }
  });

  // Focus trap implementation
  useEffect(() => {
    const previousActiveElement = document.activeElement as HTMLElement;
    
    // Mark this overlay as the active one to prevent cleanup
    if (containerRef.current) {
      markActiveLoading(containerRef.current);
      containerRef.current.focus();
    }
    
    // Handle focus trap
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      
      if (e.key === 'Tab') {
        // Find all focusable elements within container
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = containerRef.current.querySelectorAll(focusableElements);
        const firstElement = focusableContent[0] as HTMLElement;
        const lastElement = focusableContent[focusableContent.length - 1] as HTMLElement;
        
        // Lock focus inside the modal
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      // Remove active loading mark on unmount
      if (containerRef.current) {
        clearActiveLoading(containerRef.current);
      }
      
      document.removeEventListener('keydown', handleFocusTrap);
      
      // Restore focus on unmount
      if (previousActiveElement && 'focus' in previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center loading-overlay active-loading"
      aria-busy="true"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      id="fullscreen-loading-overlay"
      ref={containerRef}
      tabIndex={-1} // Make focusable for focus trap
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md mx-auto animate-fadeIn">
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
