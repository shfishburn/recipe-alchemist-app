
import { useState, useCallback, useEffect, useRef } from 'react';

interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  progress: number;
  isFetching: boolean;
}

interface UseLoadingStateOptions {
  initialState?: Partial<LoadingState>;
  autoResetOnSuccess?: boolean;
  resetDelay?: number;
}

/**
 * Custom hook for managing data loading states consistently across components.
 * Provides a standardized way to handle loading, success, error and progress states.
 */
export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const { 
    initialState = {}, 
    autoResetOnSuccess = false,
    resetDelay = 3000 
  } = options;
  
  // Set up the state with defaults and any provided initial state
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    progress: 0,
    isFetching: false,
    ...initialState
  });

  // Reference to cleanup timers on unmount or state change
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup function
  const cleanup = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);
  
  // Set loading state
  const setLoading = useCallback((isFetching: boolean = false) => {
    cleanup();
    setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      error: null,
      progress: 0,
      isFetching
    });
  }, [cleanup]);
  
  // Set success state
  const setSuccess = useCallback(() => {
    cleanup();
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      isError: false,
      isSuccess: true,
      progress: 100,
      isFetching: false
    }));
    
    if (autoResetOnSuccess) {
      resetTimerRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isSuccess: false,
        }));
      }, resetDelay);
    }
  }, [cleanup, autoResetOnSuccess, resetDelay]);
  
  // Set error state
  const setError = useCallback((error: Error | string) => {
    cleanup();
    
    const errorObject = typeof error === 'string' ? new Error(error) : error;
    
    setState({
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: errorObject,
      progress: 0,
      isFetching: false
    });
  }, [cleanup]);
  
  // Update progress value
  const setProgress = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, value))
    }));
  }, []);
  
  // Reset to initial state
  const reset = useCallback(() => {
    cleanup();
    
    setState({
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: null,
      progress: 0,
      isFetching: false
    });
  }, [cleanup]);
  
  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return {
    ...state,
    setLoading,
    setSuccess,
    setError,
    setProgress,
    reset,
  };
}

export default useLoadingState;
