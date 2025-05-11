
import React from 'react';
import { LoadingError } from '@/components/loading/LoadingError';
import { LoadingState } from '@/components/loading/LoadingState';
import { useLoadingPage } from '@/hooks/use-loading-page';

/**
 * Standalone loading page that completely replaces the app layout
 * This page exists outside the normal layout hierarchy
 */
const LoadingPage: React.FC = () => {
  const {
    error,
    progress,
    showTimeoutMessage,
    formData,
    hasTimeoutError,
    isRetrying,
    animateExit,
    handleCancel,
    handleRetry
  } = useLoadingPage();

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950 transition-opacity duration-200 ${animateExit ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-md p-4 sm:p-6 flex flex-col items-center">
        {/* Progress bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
          <div 
            className="h-full bg-recipe-green transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          />
        </div>

        {error ? (
          <LoadingError 
            error={error}
            hasTimeoutError={hasTimeoutError}
            onCancel={handleCancel}
            onRetry={handleRetry}
            isRetrying={isRetrying}
            formData={formData}
          />
        ) : (
          <LoadingState 
            progress={progress}
            showTimeoutMessage={showTimeoutMessage}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
