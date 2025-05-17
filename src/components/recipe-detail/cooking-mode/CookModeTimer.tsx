
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CookModeTimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
}

export function CookModeTimer({ 
  initialMinutes = 0, 
  onComplete 
}: CookModeTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  const formatTime = useCallback(() => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [totalSeconds]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && totalSeconds > 0) {
      timer = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1 && onComplete) {
            onComplete();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (totalSeconds === 0) {
      setIsRunning(false);
    }
    
    return () => clearInterval(timer);
  }, [isRunning, totalSeconds, onComplete]);
  
  const toggleTimer = () => {
    if (totalSeconds === 0) {
      // If timer reached zero, reset to initial time
      setTotalSeconds(initialMinutes * 60);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(initialMinutes * 60);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-500" />
            <span className="font-mono text-2xl">{formatTime()}</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTimer}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetTimer}
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
