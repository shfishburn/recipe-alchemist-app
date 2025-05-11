import React, { useEffect, useState } from 'react';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { ErrorState } from './loading/ErrorState';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function FullScreenLoading({ onCancel, onRetry, error }: FullScreenLoadingProps) {
  const { isLoading, completedLoading } = useQuickRecipeStore();
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Track if the component should stay visible
  const [isVisible, setIsVisible] = useState(true);
  
  // Track if we have an error
  const hasError = !!error;
  
  // Handle retry action
  const handleRetry = () => {
    if (onRetry) {
      setIsRetrying(true);
      // Add a small delay to show retry animation
      setTimeout(() => {
        onRetry();
        setIsRetrying(false);
      }, 300);
    }
  };
  
  // Track loading state changes to maintain visibility
  useEffect(() => {
    // Keep visible when loading or when we have an error
    if (isLoading || hasError) {
      setIsVisible(true);
    }
  }, [isLoading, hasError]);

  // Prevent hiding when still loading
  if (!isVisible && !hasError) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="loading-title"
    >
      <div className="w-full max-w-2xl p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 animate-fade-in">
        {hasError ? (
          <ErrorState
            error={error}
            onCancel={onCancel}
            onRetry={onRetry}
            isRetrying={isRetrying}
          />
        ) : (
          <QuickRecipeLoading onCancel={onCancel} />
        )}
      </div>
    </div>
  );
}

export default FullScreenLoading;
