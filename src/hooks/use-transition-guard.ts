
import { useEffect, useRef, useCallback } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { useContext } from 'react';
import type { To, NavigateOptions } from 'react-router-dom';
import { logTransition } from '@/utils/transition-debugger';

/**
 * Creates a typed proxy for the navigator.push function
 * This ensures type safety when replacing the function
 */
type NavigateFn = (to: To, state?: any, opts?: NavigateOptions) => void;

interface TransitionGuardOptions {
  /** 
   * Debug mode - enables additional logging
   */
  debug?: boolean;
}

/**
 * Hook to guard against navigation until a condition is met
 * 
 * @param shouldBlock Whether navigation should be blocked
 * @param onNavigate Callback that returns Promise<boolean> indicating whether navigation should proceed
 * @param options Additional options
 */
export function useTransitionGuard(
  shouldBlock: boolean, 
  onNavigate: () => Promise<boolean>,
  options: TransitionGuardOptions = {}
) {
  const { debug = false } = options;
  const navigator = useContext(NavigationContext).navigator;
  const originalPushRef = useRef<NavigateFn | null>(null);
  const isGuardActiveRef = useRef(false);
  
  const log = useCallback((message: string) => {
    if (debug) {
      logTransition('TransitionGuard', message);
    }
  }, [debug]);
  
  useEffect(() => {
    // Only set up the guard when shouldBlock is true and it's not already active
    if (!shouldBlock || isGuardActiveRef.current) return;
    
    log('Setting up navigation guard');
    isGuardActiveRef.current = true;
    
    // Store the original push function if not already stored
    if (!originalPushRef.current) {
      originalPushRef.current = navigator.push;
      log('Stored original navigator.push');
    }
    
    // Create a new guarded push function with the correct signature
    const guardedPush: NavigateFn = async (to, state, opts) => {
      log(`Navigation attempted to: ${to.toString()}`);
      
      try {
        // Call the callback to determine if navigation should proceed
        const canNavigate = await onNavigate();
        log(`Navigation guard result: ${canNavigate ? 'allowed' : 'blocked'}`);
        
        // Only navigate if the callback resolves to true
        if (canNavigate && originalPushRef.current) {
          log('Proceeding with navigation');
          // Use the original function with the correct parameters
          originalPushRef.current(to, state, opts);
        } else {
          log('Navigation blocked by guard');
        }
      } catch (err) {
        console.error("Error during navigation guard:", err);
        log(`Navigation guard error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        // Default to blocking navigation if the guard throws
      }
    };
    
    // Replace the push function with our guarded version
    navigator.push = guardedPush;
    
    // Restore original push function when unmounting or shouldBlock changes
    return () => {
      // Only restore if we have the original and we're the ones who replaced it
      if (originalPushRef.current && isGuardActiveRef.current) {
        log('Restoring original navigator.push');
        navigator.push = originalPushRef.current;
        isGuardActiveRef.current = false;
      }
    };
  }, [shouldBlock, onNavigate, navigator, log]);
}

export default useTransitionGuard;
