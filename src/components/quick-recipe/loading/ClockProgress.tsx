
// path: src/components/quick-recipe/loading/ClockProgress.tsx
// file: ClockProgress.tsx
// updated: 2025-05-09 14:45 PM

import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import './ClockProgress.css';
import { useTheme } from '@/hooks/use-theme';

interface ClockProgressProps {
  percentComplete: number; // 0 to 100
  showTimeout: boolean;
}

/**
 * ClockProgress renders a clock where the hour, minute, and second hands
 * represent percentComplete around a 12-hour dial. Ensures smooth animation
 * by mapping percent to total seconds over 12 hours.
 */
export function ClockProgress({ percentComplete, showTimeout }: ClockProgressProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [value, setValue] = useState(new Date());

  // Map percentComplete (0-100) to a time over a 12-hour cycle
  const percentToTime = (): Date => {
    const totalSeconds = (percentComplete / 100) * 12 * 3600;
    const hours = Math.floor(totalSeconds / 3600) % 12;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(0);
    return date;
  };

  // Update the clock value every second to ensure animation
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(percentToTime());
    }, 1000);

    // Set initial value
    setValue(percentToTime());
    
    return () => {
      clearInterval(interval);
    };
  }, [percentComplete]);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${showTimeout ? 'animate-pulse' : ''}`}>
        <Clock
          value={value}
          size={120}
          renderNumbers
          hourHandLength={50}
          hourHandWidth={4}
          minuteHandLength={70}
          minuteHandWidth={3}
          secondHandLength={75}
          secondHandWidth={2}
          hourMarksLength={10}
          hourMarksWidth={2}
          minuteMarksLength={5}
          minuteMarksWidth={1}
          className={`clock-progress ${isDark ? 'text-white' : 'text-black'}`}
        />

        {/* Overlay showing actual percentage for accessibility */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-medium bg-background/80 px-2 py-0.5 rounded-full animate-fade-in">
            {Math.min(100, Math.max(0, Math.round(percentComplete)))}%
          </span>
        </div>
      </div>

      <p className="text-xs mt-2 text-muted-foreground animate-pulse">
        Recipe generation in progress
      </p>
    </div>
  );
}
