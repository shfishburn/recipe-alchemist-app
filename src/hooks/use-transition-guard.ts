
import { useEffect, useRef } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { useContext } from 'react';

/**
 * Hook to guard against navigation until a condition is met
 * @param shouldBlock Whether navigation should be blocked
 * @param onNavigate Callback that returns Promise<boolean> indicating whether navigation should proceed
 */
export function useTransitionGuard(
  shouldBlock: boolean, 
  onNavigate: () => Promise<boolean>
) {
  const navigator = useContext(NavigationContext).navigator;
  const originalPushRef = useRef<Function | null>(null);
  
  useEffect(() => {
    // Only set up the guard when shouldBlock is true
    if (!shouldBlock) return;
    
    // Store the original push function if not already stored
    if (!originalPushRef.current) {
      originalPushRef.current = navigator.push;
    }
    
    // Create a new guarded push function
    const guardedPush = async (...args: any[]) => {
      try {
        // Call the callback to determine if navigation should proceed
        const canNavigate = await onNavigate();
        
        // Only navigate if the callback resolves to true
        if (canNavigate && originalPushRef.current) {
          originalPushRef.current.apply(navigator, args);
        }
      } catch (err) {
        console.error("Error during navigation guard:", err);
        // Default to blocking navigation if the guard throws
      }
    };
    
    // Replace the push function with our guarded version
    navigator.push = guardedPush;
    
    // Restore original push function when unmounting or shouldBlock changes
    return () => {
      // Only restore if we have the original and we're the ones who replaced it
      if (originalPushRef.current) {
        navigator.push = originalPushRef.current;
      }
    };
  }, [shouldBlock, onNavigate, navigator]);
}

export default useTransitionGuard;
