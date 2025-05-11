
import { useEffect } from 'react';
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

  useEffect(() => {
    if (!shouldBlock) return;

    // Store the original push function
    const originalPush = navigator.push;
    
    // Override the push function with our guarded version
    navigator.push = async (...args: any[]) => {
      try {
        // Call the callback to determine if navigation should proceed
        const canNavigate = await onNavigate();
        if (canNavigate) {
          originalPush.apply(navigator, args);
        }
      } catch (err) {
        console.error("Error during navigation guard:", err);
        // Default to blocking navigation if the guard throws
      }
    };

    // Restore original push function when unmounting or shouldBlock changes
    return () => {
      navigator.push = originalPush;
    };
  }, [shouldBlock, onNavigate, navigator]);
}

export default useTransitionGuard;
