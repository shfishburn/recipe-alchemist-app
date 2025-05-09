
import React from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { useTheme } from '@/hooks/use-theme';

interface ClockProgressProps {
  percentComplete: number;
  showTimeout: boolean;
}

export function ClockProgress({ percentComplete, showTimeout }: ClockProgressProps) {
  // Convert percentage to time (12-hour format)
  // 0% = 12:00, 100% = 11:59 (almost full circle)
  const percentToTime = () => {
    // Convert percent to hours (0% = 12, 100% = almost 12 again)
    const hours = 12;
    
    // Convert percent to minutes (0% = 0 minutes, 100% = 59 minutes)
    const minutes = Math.min(59, Math.floor((percentComplete / 100) * 60));
    
    // Convert percent to seconds (for smoother animation)
    const seconds = Math.floor(((percentComplete / 100) * 60 * 60) % 60);
    
    // Create a date object at the current day but with our calculated time
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date;
  };
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${showTimeout ? 'animate-pulse' : ''}`}>
        <Clock 
          value={percentToTime()}
          size={120}
          renderNumbers={true}
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
          className="clock-progress"
        />
        
        {/* Overlay showing actual percentage for accessibility */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-sm font-medium bg-background/80 px-2 py-0.5 rounded-full">
            {Math.round(percentComplete)}%
          </span>
        </div>
      </div>
      
      <p className="text-xs mt-2 text-muted-foreground">
        Recipe generation in progress
      </p>
    </div>
  );
}
