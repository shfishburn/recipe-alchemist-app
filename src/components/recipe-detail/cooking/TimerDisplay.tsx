
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

  // Effect to show toast notification when time is running low
  useEffect(() => {
    if (isLowTime && timeRemaining === 30) {
      toast({
        title: "Timer Alert",
        description: "30 seconds remaining on your timer!",
        variant: "destructive",
      });
    } else if (isLowTime && timeRemaining === 10) {
      toast({
        title: "Timer Alert",
        description: "10 seconds remaining on your timer!",
        variant: "destructive",
      });
    } else if (timeRemaining === 0) {
      toast({
        title: "Timer Complete",
        description: "Your timer has finished!",
        variant: "destructive",
      });
    }
  }, [timeRemaining, isLowTime]);

  // Add pulsing animation for low time
  const pulsingClass = isLowTime ? "animate-pulse" : "";

  return (
    <div className={cn(
      "p-6 rounded-lg border text-center w-full",
      isLowTime ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100",
      pulsingClass
    )}>
      <div className={cn(
        "text-3xl font-bold mb-2",
        isLowTime ? "text-red-600" : "text-blue-600"
      )}>
        {formatTime(timeRemaining)}
      </div>
      <Button 
        variant="destructive" 
        onClick={onCancel}
        className="gap-1.5"
      >
        <StopCircle className="h-4 w-4" />
        Stop Timer
      </Button>
    </div>
  );
}
