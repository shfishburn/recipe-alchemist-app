
import React, { useEffect } from 'react';
import { StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface TimerDisplayProps {
  timeRemaining: number;
  onCancel: () => void;
  isLowTime?: boolean;
}

export function TimerDisplay({ 
  timeRemaining, 
  onCancel,
  isLowTime = false
}: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add a title element for accessibility
  const timerTitle = isLowTime ? "Time is running low" : "Timer running";
  
  // Add pulsing animation for low time
  const pulsingClass = isLowTime ? "animate-pulse" : "";

  return (
    <div 
      className={cn(
        "p-6 rounded-lg border text-center w-full",
        isLowTime ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100",
        pulsingClass
      )}
      role="timer" 
      aria-label={`Timer: ${formatTime(timeRemaining)}`}
      aria-live="polite"
    >
      <div className={cn(
        "text-3xl font-bold mb-2",
        isLowTime ? "text-red-600" : "text-blue-600"
      )}>
        <span aria-hidden="true">{formatTime(timeRemaining)}</span>
        <span className="sr-only">{formatTime(timeRemaining)} remaining</span>
      </div>
      <Button 
        variant="destructive" 
        onClick={onCancel}
        className="gap-1.5 touch-target"
        aria-label="Stop timer"
      >
        <StopCircle className="h-4 w-4" />
        Stop Timer
      </Button>
    </div>
  );
}
