
import React from 'react';
import { cn } from '@/lib/utils';

interface TopLoadingBarProps {
  showFinalAnimation?: boolean;
  color?: string;
}

export function TopLoadingBar({ 
  showFinalAnimation = false, 
  color = '#4CAF50'
}: TopLoadingBarProps) {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 z-[10000]"
      aria-hidden="true"
    >
      <div 
        className={cn(
          "h-full animate-progress-bar",
          showFinalAnimation ? "w-full" : ""
        )}
        style={{ 
          backgroundImage: `linear-gradient(to right, ${color}, ${color})`,
          width: showFinalAnimation ? '100%' : undefined,
          transition: 'width 0.3s ease-out'
        }}
      />
    </div>
  );
}
