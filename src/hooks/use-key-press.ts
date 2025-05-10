
import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard key press events
 * 
 * @param key The key to listen for (e.g., 'Escape', 'Enter')
 * @param callback The function to call when the key is pressed
 * @param active Whether the listener is active (default: true)
 */
export const useKeyPress = (
  key: string, 
  callback: () => void, 
  active: boolean = true
) => {
  useEffect(() => {
    if (!active) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, active]);
};
