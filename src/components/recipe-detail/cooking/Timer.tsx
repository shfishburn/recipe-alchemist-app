
import React from 'react';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';

interface TimerProps {
  timeRemaining: number | null;
  onStart: (minutes: number) => void;
  onCancel: () => void;
  isLowTime?: boolean;
}

export function Timer({ 
  timeRemaining, 
  onStart, 
  onCancel,
  isLowTime = false
}: TimerProps) {
  return (
    <div className="mt-8 flex flex-col items-center">
      {timeRemaining !== null ? (
        <TimerDisplay
          timeRemaining={timeRemaining}
          onCancel={onCancel}
          isLowTime={isLowTime}
        />
      ) : (
        <TimerControls onStart={onStart} />
      )}
    </div>
  );
}
