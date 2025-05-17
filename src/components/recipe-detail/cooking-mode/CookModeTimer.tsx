
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, X, Play, Pause, RotateCcw } from 'lucide-react';

interface CookModeTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CookModeTimer({ isOpen, onClose }: CookModeTimerProps) {
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes * 60 seconds

  // Set initial time when minutes/seconds inputs change
  useEffect(() => {
    setTimeRemaining((minutes * 60) + seconds);
  }, [minutes, seconds]);

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsRunning(false);
      // Add notification sound or visual alert here
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Format time for display
  const formatTime = () => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining((minutes * 60) + seconds);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Timer</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isRunning ? (
          <div className="text-5xl font-bold text-center my-8">
            {formatTime()}
          </div>
        ) : (
          <div className="flex gap-2 my-4">
            <div className="flex-1">
              <label htmlFor="minutes" className="block text-sm text-gray-600 mb-1">Minutes</label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="60"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="seconds" className="block text-sm text-gray-600 mb-1">Seconds</label>
              <Input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-6">
          <Button
            className="flex-1"
            onClick={handleStartPause}
          >
            {isRunning ? (
              <><Pause className="h-4 w-4 mr-2" /> Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Start</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
