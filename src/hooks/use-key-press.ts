
import { useEffect, useCallback } from 'react';

/**
 * Hook that triggers a callback when a specific key is pressed
 * @param targetKey - Key to listen for (e.g., 'Escape', 'Enter')
 * @param callback - Function to call when key is pressed
 */
export function useKeyPress(targetKey: string, callback: () => void) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback();
      }
    },
    [targetKey, callback]
  );

  useEffect(() => {
    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}
