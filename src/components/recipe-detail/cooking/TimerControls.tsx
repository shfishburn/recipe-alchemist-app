
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerControlsProps {
  onStart: (minutes: number) => void;
  presetTimes?: number[];
}

export function TimerControls({ 
  onStart,
  presetTimes = [1, 3, 5, 10] 
}: TimerControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {presetTimes.map((mins) => (
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
  );
}
