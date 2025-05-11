
import React, { useState, useEffect } from 'react';
import { QuickRecipeLoading } from './QuickRecipeLoading';
import { ErrorState } from './loading/ErrorState';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface FullScreenLoadingProps {
  onCancel?: () => void;
  onRetry?: () => void;
  error?: string | null;
}

export function FullScreenLoading({ onCancel, onRetry, error }: FullScreenLoadingProps) {
  const { isLoading } = useQuickRecipeStore();
  const [isRetrying, setIsRetrying] = useState(false);
  
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

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-background/95 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="loading-title"
      style={{
        position: 'fixed',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0
      }}
    >
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 m-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 animate-fade-in">
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
