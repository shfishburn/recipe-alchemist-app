
import { useRef, useCallback } from 'react';

export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Function to create a new abort controller
  const createAbortController = useCallback(() => {
    // Clean up any existing controller
    if (abortControllerRef.current) {
      console.log("Aborting previous request");
      abortControllerRef.current.abort();
    }
    // Create a new controller
    console.log("Creating new AbortController");
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  // Cleanup function for unmounting
  const cleanupRequestState = useCallback(() => {
    // Abort any pending requests on unmount
    if (abortControllerRef.current) {
      console.log("Cleaning up AbortController on unmount");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  
  return {
    abortControllerRef,
    createAbortController,
    cleanupRequestState
  };
}
