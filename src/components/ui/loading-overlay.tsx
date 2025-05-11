
import React, { useEffect, useRef, ReactNode } from 'react';
import { useKeyPress } from '@/hooks/use-key-press';

interface LoadingOverlayProps {
  children: ReactNode;
  onCancel?: () => void;
  isError?: boolean;
  isOpen?: boolean;
  className?: string;
}

export function LoadingOverlay({ 
  children, 
  onCancel, 
  isError = false,
  isOpen = true, 
  className = ""
}: LoadingOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  // Handle Escape key press for closing
  useKeyPress('Escape', () => {
    if (onCancel && isOpen) {
      onCancel();
    }
  });

  // Focus trap implementation
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the container
      if (containerRef.current) {
        containerRef.current.focus();
      }
      
      // Set up focus trap
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (!containerRef.current || !isOpen) return;
        
        if (e.key === 'Tab') {
          // Find all focusable elements within container
          const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const focusableContent = containerRef.current.querySelectorAll(focusableElements);
          
          if (focusableContent.length === 0) return;
          
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
        document.removeEventListener('keydown', handleFocusTrap);
        
        // Restore focus when component unmounts or closes
        if (previousActiveElement.current && 'focus' in previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onCancel]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 loading-overlay"
      role="dialog"
      aria-modal="true"
      aria-busy={!isError}
      aria-live={isError ? "assertive" : "polite"}
      ref={containerRef}
      tabIndex={-1}
      data-state={isOpen ? "open" : "closed"}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default LoadingOverlay;
