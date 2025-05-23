
import React, { useEffect, useRef } from 'react';
import { calculateReadTime } from '@/utils/read-time';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ReadTimeDisplayProps {
  text: string;
  className?: string;
  showIcon?: boolean;
}

export const ReadTimeDisplay: React.FC<ReadTimeDisplayProps> = ({ 
  text, 
  className = '',
  showIcon = true
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const { displayText } = calculateReadTime(text);
  
  // Extract just the text part without the clock emoji since we're using the Clock icon
  const textContent = displayText.replace('🕒 ', '');
  
  useEffect(() => {
    const badge = badgeRef.current;
    if (!badge) return;
    
    // Initial state - hidden
    badge.style.opacity = '0';
    
    // Trigger animation after mount
    const timeoutId = setTimeout(() => {
      badge.style.opacity = '1';
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div 
      ref={badgeRef}
      className={`transition-opacity duration-600 ${className}`}
      style={{ transitionProperty: 'opacity' }}
    >
      <Badge variant="outline" className="flex items-center gap-1 font-normal">
        {showIcon && <Clock className="h-3 w-3" />}
        <span>{textContent}</span>
      </Badge>
    </div>
  );
};
