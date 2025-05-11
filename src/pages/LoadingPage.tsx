
import React, { useEffect } from 'react';
import { LoadingError } from '@/components/loading/LoadingError';
import { LoadingState } from '@/components/loading/LoadingState';
import { useLoadingPage } from '@/hooks/use-loading-page';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { logTransition } from '@/utils/transition-debugger';

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
    handleRetry,
    ready
  } = useLoadingPage();
  
  // Log initial render and key state changes
  useEffect(() => {
    logTransition('LoadingPage', 'Page mounted', { 
      hasError: !!error, 
      progress, 
      hasFormData: !!formData 
    });
    
    return () => {
      logTransition('LoadingPage', 'Page unmounted');
    };
  }, []);
  
  // Log significant state changes
  useEffect(() => {
    if (error) {
      logTransition('LoadingPage', 'Error state detected', { error });
    }
    if (animateExit) {
      logTransition('LoadingPage', 'Exit animation triggered');
    }
  }, [error, animateExit]);

  return (
    <PageWrapper
      isLoading={true}
      ready={ready}
      className={`fixed inset-0 z-[9999] flex items-center justify-center w-full h-screen bg-white dark:bg-gray-950 transition-opacity duration-400 ${animateExit ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="w-full max-w-md p-4 sm:p-6 flex flex-col items-center">
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
    </PageWrapper>
  );
};

export default LoadingPage;
