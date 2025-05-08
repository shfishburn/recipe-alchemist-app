
import React from 'react';
import { cn } from '@/lib/utils';

interface CarouselDotsProps {
  totalItems: number;
  activeIndex: number;
  onClick: (index: number) => void;
  className?: string;
}

export function CarouselDots({
  totalItems,
  activeIndex,
  onClick,
  className
}: CarouselDotsProps) {
  // Don't render if there's only one or zero items
  if (totalItems <= 1) return null;
  
  return (
    <div 
      className={cn("carousel-pagination", className)} 
      role="tablist"
      aria-label="Carousel navigation"
    >
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "carousel-pagination-dot",
            activeIndex === index ? "carousel-pagination-dot-active" : ""
          )}
          onClick={() => onClick(index)}
          role="tab"
          aria-selected={activeIndex === index}
          aria-label={`Go to slide ${index + 1}`}
          tabIndex={activeIndex === index ? 0 : -1}
        />
      ))}
    </div>
  );
}
