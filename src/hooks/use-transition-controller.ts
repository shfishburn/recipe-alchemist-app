
import { useState, useCallback, useRef, useEffect } from 'react';
import { useTransitionGuard } from './use-transition-guard';
import { logTransition } from '@/utils/transition-debugger';

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
  
  /**
   * Debug mode to log transition events
   */
  debug?: boolean;
}

/**
 * Hook that provides a unified API for transition control
 * Combines both readiness state and navigation guarding
 */
export function useTransitionController({
  initialReady = true,
  blockByDefault = false,
  onNavigationAttempt,
  debug = false
}: TransitionControllerOptions = {}) {
  const [isReady, setIsReady] = useState(initialReady);
  const [isBlocking, setIsBlocking] = useState(blockByDefault);
  
  // Log debug info if debug mode is enabled
  const logDebug = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      logTransition('TransitionController', message, ...args);
    }
  }, [debug]);
  
  // Default navigation handler that can be overridden
  const defaultNavigationHandler = useCallback(async (): Promise<boolean> => {
    logDebug("Navigation attempted, ready state:", isReady);
    // By default, allow navigation if we're ready
    return isReady;
  }, [isReady, logDebug]);
  
  // Use the custom handler if provided, otherwise use default
  const navigationHandler = onNavigationAttempt || defaultNavigationHandler;
  
  // Set up the navigation guard with improved typing
  useTransitionGuard(isBlocking, navigationHandler, { debug });
  
  // Helper to block while an async operation completes
  const withBlockedNavigation = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    logDebug("Blocking navigation for operation");
    setIsBlocking(true);
    try {
      return await fn();
    } finally {
      logDebug("Unblocking navigation after operation");
      setIsBlocking(false);
    }
  }, [logDebug]);
  
  // Helper to delay transition until an operation completes
  const withDelayedTransition = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    logDebug("Delaying transition for operation");
    setIsReady(false);
    try {
      return await fn();
    } finally {
      logDebug("Marking as ready after delayed operation");
      setIsReady(true);
    }
  }, [logDebug]);
  
  return {
    isReady,
    setIsReady,
    isBlocking,
    setIsBlocking,
    withBlockedNavigation,
    withDelayedTransition,
  };
}

export default useTransitionController;
