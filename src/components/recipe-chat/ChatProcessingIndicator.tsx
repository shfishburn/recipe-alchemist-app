
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatProcessingIndicatorProps {
  stage: 'sending' | 'analyzing' | 'applying';
  className?: string;
}

export function ChatProcessingIndicator({ stage, className }: ChatProcessingIndicatorProps) {
  const isMobile = useIsMobile();
  const [dots, setDots] = useState('.');
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Add animated dots and timing for better user feedback
  useEffect(() => {
    // Animate dots
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    // Track elapsed time for long operations
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(dotInterval);
      clearInterval(timeInterval);
    };
  }, []);
  
  // For long-running operations, show additional feedback
  const getTimingFeedback = () => {
    if (elapsedTime > 10) {
      return " This is taking longer than expected.";
    }
    return "";
  };
  
  const messages = {
    sending: `Sending message${dots}`,
    analyzing: `Chef is thinking${dots}`,
    applying: `Applying improvements${dots}${getTimingFeedback()}`
  };

  return (
    <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground rounded-md border border-border/50 bg-white/70 px-2 py-1 sm:px-3 sm:py-2 shadow-sm ${className}`}>
      <Loader2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} animate-spin text-primary`} />
      <span className="animate-pulse">{messages[stage]}</span>
    </div>
  );
}
