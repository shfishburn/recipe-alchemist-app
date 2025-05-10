
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TopLoadingBarProps {
  showFinalAnimation?: boolean;
  color?: string;
}

export function TopLoadingBar({ 
  showFinalAnimation = false, 
  color = '#4CAF50'
}: TopLoadingBarProps) {
  const [width, setWidth] = useState<string>(showFinalAnimation ? '100%' : '0%');
  
  useEffect(() => {
    // On initial mount, start the loading animation
    if (!showFinalAnimation) {
      // Start with a small width to show immediate feedback
      setWidth('5%');
      
      // After a small delay, animate to 90% while waiting
      const timeoutId = setTimeout(() => {
        setWidth('90%');
      }, 50);
      
      return () => clearTimeout(timeoutId);
    } else {
      // When final animation should show, go to 100%
      setWidth('100%');
    }
  }, [showFinalAnimation]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 z-[10000]"
      aria-hidden="true"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={showFinalAnimation ? 100 : 90}
    >
      <div 
        className={cn(
          "h-full transition-all duration-300 ease-out",
          showFinalAnimation ? "transition-all duration-500" : "transition-all duration-2000"
        )}
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}80`,
          width: width
        }}
      />
    </div>
  );
}
