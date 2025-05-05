
import React from 'react';
import { Timer as TimerIcon, Play, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeRemaining: number | null;
  onStart: (minutes: number) => void;
  onCancel: () => void;
}

export function Timer({ timeRemaining, onStart, onCancel }: TimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      {timeRemaining !== null ? (
        <div className={cn(
          "p-6 rounded-lg border text-center w-full",
          timeRemaining < 30 ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-100"
        )}>
          <div className={cn(
            "text-3xl font-bold mb-2",
            timeRemaining < 30 ? "text-red-600" : "text-blue-600"
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
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 3, 5, 10].map((mins) => (
            <Button 
              key={mins}
              variant="outline" 
              onClick={() => onStart(mins)}
              className="min-w-[80px]"
            >
              <Play className="h-4 w-4 mr-2" />
              {mins} min
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
