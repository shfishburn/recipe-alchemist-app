
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CarouselDotsProps {
  totalItems: number;
  selectedIndex: number;
  onClick?: (index: number) => void;
  className?: string;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({ 
  totalItems, 
  selectedIndex,
  onClick,
  className
}) => {
  const isMobile = useIsMobile();
  
  // Don't render if there's only one item
  if (totalItems <= 1) return null;

  return (
    <div 
      className={cn("carousel-pagination", className)}
      role="tablist"
      aria-label="Carousel pagination"
    >
      {Array.from({ length: totalItems }).map((_, i) => (
        <button
          key={i}
          className={cn(
            "carousel-pagination-dot",
            selectedIndex === i ? "carousel-pagination-dot-active" : ""
          )}
          onClick={() => onClick?.(i)}
          role="tab"
          aria-selected={selectedIndex === i}
          aria-label={`Go to slide ${i + 1}`}
          tabIndex={selectedIndex === i ? 0 : -1}
        />
      ))}
    </div>
  );
};
