
import { useState, useEffect, useCallback } from 'react';

interface UseTimerResult {
  timeRemaining: number | null;
  startTimer: (minutes: number) => void;
  cancelTimer: () => void;
  isActive: boolean;
}

export function useTimer(): UseTimerResult {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining]);
  
  const startTimer = useCallback((minutes: number) => {
    setTimeRemaining(minutes * 60);
  }, []);
  
  const cancelTimer = useCallback(() => {
    setTimeRemaining(null);
  }, []);
  
  return {
    timeRemaining,
    startTimer,
    cancelTimer,
    isActive: timeRemaining !== null
  };
}
