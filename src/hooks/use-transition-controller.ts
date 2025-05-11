
import { useState, useCallback } from 'react';
import { useTransitionGuard } from './use-transition-guard';

interface TransitionControllerOptions {
  /**
   * Initial ready state
   */
  initialReady?: boolean;
  
  /**
   * Whether to block navigation by default
   */
  blockByDefault?: boolean;
  
  /**
   * Custom navigation block handler
   */
  onNavigationAttempt?: () => Promise<boolean>;
}

/**
 * Hook that provides a unified API for transition control
 * Combines both readiness state and navigation guarding
 */
export function useTransitionController({
  initialReady = true,
  blockByDefault = false,
  onNavigationAttempt
}: TransitionControllerOptions = {}) {
  const [isReady, setIsReady] = useState(initialReady);
  const [isBlocking, setIsBlocking] = useState(blockByDefault);
  
  // Default navigation handler that can be overridden
  const defaultNavigationHandler = useCallback(async (): Promise<boolean> => {
    // By default, allow navigation if we're ready
    return isReady;
  }, [isReady]);
  
  // Use the custom handler if provided, otherwise use default
  const navigationHandler = onNavigationAttempt || defaultNavigationHandler;
  
  // Set up the navigation guard
  useTransitionGuard(isBlocking, navigationHandler);
  
  // Helper to block while an async operation completes
  const withBlockedNavigation = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsBlocking(true);
    try {
      return await fn();
    } finally {
      setIsBlocking(false);
    }
  }, []);
  
  // Helper to delay transition until an operation completes
  const withDelayedTransition = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsReady(false);
    try {
      return await fn();
    } finally {
      setIsReady(true);
    }
  }, []);
  
  return {
    isReady,
    setIsReady,
    isBlocking,
    setIsBlocking,
    withBlockedNavigation,
    withDelayedTransition
  };
}

export default useTransitionController;
