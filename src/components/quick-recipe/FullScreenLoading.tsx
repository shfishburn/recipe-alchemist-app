
import React, { useEffect } from 'react';
import { QuickRecipeLoading } from './QuickRecipeLoading';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
  isRetrying?: boolean;
}

export function FullScreenLoading({ onCancel, onRetry, error, isRetrying }: FullScreenLoadingProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Disable scrolling on the body when modal is open
    document.body.classList.add('overflow-hidden');
    
    return () => {
      // Enable scrolling when modal is closed
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <QuickRecipeLoading />
      </div>
    </div>
  );
}
