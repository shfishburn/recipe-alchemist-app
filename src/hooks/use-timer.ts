
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSoundEffect } from '@/hooks/use-sound-effect';

interface UseTimerResult {
  timeRemaining: number | null;
  startTimer: (minutes: number) => void;
  cancelTimer: () => void;
  isActive: boolean;
  isLowTime: boolean;
}

export function useTimer(): UseTimerResult {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLowTime, setIsLowTime] = useState(false);
  const LOW_TIME_THRESHOLD = 30; // seconds

  // Sound effects for timer notifications
  const { play } = useSoundEffect();
  
  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining === null) return;
    
    // Reset low time state when timer is started
    if (timeRemaining > LOW_TIME_THRESHOLD) {
      setIsLowTime(false);
    }
    
    // Handle timer completion
    if (timeRemaining === 0) {
      toast({
        title: "Timer Complete",
        description: "Your timer has finished!",
        variant: "destructive",
      });
      play('/lovable-uploads/typing.mp3');
      return;
    }
    
    // Set low time warning state
    if (timeRemaining <= LOW_TIME_THRESHOLD && !isLowTime) {
      setIsLowTime(true);
      toast({
        title: "Timer Alert",
        description: `${LOW_TIME_THRESHOLD} seconds remaining!`,
        variant: "destructive",
      });
      play('/lovable-uploads/typing.mp3');
    }
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => (prev !== null && prev > 0) ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, isLowTime, play]);
  
  const startTimer = useCallback((minutes: number) => {
    setTimeRemaining(minutes * 60);
    setIsLowTime(false);
  }, []);
  
  const cancelTimer = useCallback(() => {
    setTimeRemaining(null);
    setIsLowTime(false);
  }, []);
  
  return {
    timeRemaining,
    startTimer,
    cancelTimer,
    isActive: timeRemaining !== null,
    isLowTime
  };
}
