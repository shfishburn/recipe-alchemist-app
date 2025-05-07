
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CarouselDotsProps {
  totalItems: number;
  selectedIndex: number;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({ 
  totalItems, 
  selectedIndex 
}) => {
  const isMobile = useIsMobile();
  
  // Optimize rendering for many dots
  const dots = React.useMemo(() => {
    return Array.from({ length: totalItems }).map((_, i) => {
      const isActive = i === selectedIndex;
      return (
        <span
          key={i}
          className={cn(
            "inline-block rounded-full transition-all hw-accelerated",
            isActive 
              ? "w-2 h-2 bg-recipe-blue"
              : "w-1.5 h-1.5 bg-gray-300 opacity-70",
            isMobile && "touch-target-base",
          )}
          aria-hidden="true"
        />
      );
    });
  }, [totalItems, selectedIndex, isMobile]);

  // Don't render if there's only one item
  if (totalItems <= 1) return null;

  return (
    <div 
      className="flex items-center justify-center space-x-2 hw-accelerated"
      role="tablist"
      aria-label="Carousel pagination"
    >
      {dots}
    </div>
  );
};
