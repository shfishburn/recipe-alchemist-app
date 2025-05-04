
import React from 'react';
import { StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  return (
    <div className={cn(
      "p-6 rounded-lg border text-center w-full",
      isLowTime ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100"
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
