
import React from 'react';
import { TimerDisplay } from './TimerDisplay';
import { TimerControls } from './TimerControls';

interface TimerProps {
  timeRemaining: number | null;
  onStart: (minutes: number) => void;
  onCancel: () => void;
}

export function Timer({ timeRemaining, onStart, onCancel }: TimerProps) {
  const LOW_TIME_THRESHOLD = 30; // seconds

  return (
    <div className="mt-8 flex flex-col items-center">
      {timeRemaining !== null ? (
        <TimerDisplay
          timeRemaining={timeRemaining}
          onCancel={onCancel}
          isLowTime={timeRemaining < LOW_TIME_THRESHOLD}
        />
      ) : (
        <TimerControls onStart={onStart} />
      )}
    </div>
  );
}
