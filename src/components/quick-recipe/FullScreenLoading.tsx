import React, { useEffect, useRef } from 'react';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { useLoadingProgress } from '@/hooks/use-loading-progress';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { TopLoadingBar } from './loading/TopLoadingBar';
import { ErrorState } from './loading/ErrorState';
import { LoadingContainer } from './loading/LoadingContainer';
import { cn } from '@/lib/utils';
import { forceCleanupUI, ensureRecipeLoadingActive } from '@/utils/dom-cleanup';

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
  const { loadingState } = useQuickRecipeStore();
  const isErrorState = !!error;
  const { showTimeout, showFinalAnimation } = useLoadingProgress();
  
  // Ref to track mounting state
  const isMounted = useRef(false);
  // Ref to store interval ID
  const activeIntervalRef = useRef<number | null>(null);
  
  // Enhanced body overflow control with cleanup and navbar hiding
  useEffect(() => {
    // Log when component mounts/unmounts for debugging
    console.log('FullScreenLoading component mounted', { isErrorState });
    isMounted.current = true;
    
    // Only modify the DOM if this component is actually mounted
    const loadingElement = document.getElementById('fullscreen-loading-overlay');
    if (!loadingElement) {
      console.warn('Loading overlay element not found in DOM');
      return;
    }
    
    // Force position fixed to prevent scrolling while loading
    if (document.body) {
      document.body.classList.add('overflow-hidden');
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';
    }
    
    // Add a loading-trigger marker to help with cleanup detection
    const loadingTrigger = document.createElement('div');
    loadingTrigger.id = 'loading-trigger-marker';
    loadingTrigger.classList.add('loading-trigger');
    loadingTrigger.classList.add('loading-overlay-active');
    loadingTrigger.style.display = 'none';
    document.body?.appendChild(loadingTrigger);
    
    // Hide all navbars during loading
    const navbars = document.querySelectorAll('nav, header');
    navbars.forEach(navbar => {
      if (navbar instanceof HTMLElement) {
        navbar.style.visibility = 'hidden';
        navbar.setAttribute('aria-hidden', 'true');
        navbar.dataset.hiddenByLoading = 'true';
      }
    });
    
    // Make sure our loading is properly marked as active
    ensureRecipeLoadingActive();
    
    // Keep checking that the loading overlay remains active
    if (activeIntervalRef.current) {
      window.clearInterval(activeIntervalRef.current);
    }
    
    activeIntervalRef.current = window.setInterval(() => {
      if (isMounted.current) {
        ensureRecipeLoadingActive();
      }
    }, 1000);
    
    return () => {
      // Ensure we clean up properly on unmount
      console.log('FullScreenLoading component unmounted - cleaning up DOM modifications');
      isMounted.current = false;
      
      // Clear the interval
      if (activeIntervalRef.current !== null) {
        window.clearInterval(activeIntervalRef.current);
        activeIntervalRef.current = null;
      }
      
      // Restore body state
      if (document.body) {
        document.body.classList.remove('overflow-hidden');
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.left = '';
      }
      
      // Show all navbars again
      const hiddenNavbars = document.querySelectorAll('[data-hidden-by-loading="true"]');
      hiddenNavbars.forEach(navbar => {
        if (navbar instanceof HTMLElement) {
          navbar.style.visibility = '';
          navbar.removeAttribute('aria-hidden');
          navbar.removeAttribute('data-hidden-by-loading');
        }
      });
      
      // Remove any loading triggers we created
      const loadingTrigger = document.getElementById('loading-trigger-marker');
      if (loadingTrigger && loadingTrigger.parentNode) {
        loadingTrigger.parentNode.removeChild(loadingTrigger);
      }
      
      // Force cleanup UI as a safety measure
      forceCleanupUI();
    };
  }, [isErrorState]);
  
  // Ensure the component is visible - debug info
  console.log('Rendering FullScreenLoading', { 
    loadingState, 
    showTimeout, 
    showFinalAnimation,
    isErrorState 
  });
  
  return (
    <div 
      className={cn(
        "loading-overlay active-loading fixed inset-0 flex flex-col items-center justify-center p-4 z-[9999]",
        "animate-fadeIn touch-action-none hw-accelerated",
        isErrorState ? "bg-gray-900/60" : "bg-white dark:bg-gray-900/95"
      )}
      aria-modal="true"
      role="dialog"
      style={{ 
        opacity: 1, 
        visibility: 'visible',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
      }}
      id="fullscreen-loading-overlay"
    >
      <TopLoadingBar showFinalAnimation={showFinalAnimation} color="#4CAF50" />
      
      {/* Accessible title for screen readers */}
      <VisuallyHidden asChild>
        <h1>
          {isErrorState ? "Recipe Generation Failed" : "Generating Your Recipe"}
        </h1>
      </VisuallyHidden>
      
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center py-12">
        {isErrorState ? (
          <ErrorState 
            error={error}
            onCancel={onCancel}
            onRetry={onRetry}
          />
        ) : (
          <LoadingContainer
            loadingState={loadingState}
            showTimeout={showTimeout}
            showFinalAnimation={showFinalAnimation}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
});

export default FullScreenLoading;
