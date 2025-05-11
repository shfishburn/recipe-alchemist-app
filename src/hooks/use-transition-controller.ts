
import { useState, useCallback, useRef, useEffect } from 'react';
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
  const pendingTransitions = useRef<Array<() => Promise<void>>>([]);
  const isTransitioning = useRef(false);
  
  // Log debug info if debug mode is enabled
  const logDebug = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[TransitionController] ${message}`, ...args);
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
  
  // Set up the navigation guard
  useTransitionGuard(isBlocking, navigationHandler);
  
  // Process any pending transitions when previous ones complete
  useEffect(() => {
    const processPendingTransitions = async () => {
      if (isTransitioning.current || pendingTransitions.current.length === 0) {
        return;
      }
      
      try {
        isTransitioning.current = true;
        const nextTransition = pendingTransitions.current.shift();
        if (nextTransition) {
          logDebug("Processing pending transition");
          await nextTransition();
        }
      } finally {
        isTransitioning.current = false;
        
        // Check if there are more pending transitions
        if (pendingTransitions.current.length > 0) {
          processPendingTransitions();
        }
      }
    };
    
    if (!isTransitioning.current && pendingTransitions.current.length > 0) {
      processPendingTransitions();
    }
  }, [logDebug]);
  
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
  
  // Queue a transition to be processed when previous ones complete
  const queueTransition = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      logDebug("Queueing transition");
      
      pendingTransitions.current.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      // If not transitioning, process the queue
      if (!isTransitioning.current) {
        setImmediate(() => {
          if (pendingTransitions.current.length > 0 && !isTransitioning.current) {
            const nextTransition = pendingTransitions.current.shift();
            if (nextTransition) {
              isTransitioning.current = true;
              nextTransition().finally(() => {
                isTransitioning.current = false;
              });
            }
          }
        });
      }
    });
  }, [logDebug]);
  
  return {
    isReady,
    setIsReady,
    isBlocking,
    setIsBlocking,
    withBlockedNavigation,
    withDelayedTransition,
    queueTransition
  };
}

export default useTransitionController;
