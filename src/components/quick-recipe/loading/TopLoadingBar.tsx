
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
    if (!showFinalAnimation) {
      // Start at 0% and animate to 90% while waiting
      setWidth('90%');
    } else {
      // When final animation should show, go to 100%
      setWidth('100%');
    }
  }, [showFinalAnimation]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 z-[10000]"
      aria-hidden="true"
    >
      <div 
        className={cn(
          "h-full bg-recipe-green transition-all duration-300 ease-out",
          showFinalAnimation ? "w-full" : ""
        )}
        style={{ 
          backgroundImage: `linear-gradient(to right, ${color}, ${color})`,
          width: width
        }}
      />
    </div>
  );
}
