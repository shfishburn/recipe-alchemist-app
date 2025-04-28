
import React from 'react';

interface CarouselDotsProps {
  totalItems: number;
  selectedIndex: number;
}

export function CarouselDots({ totalItems, selectedIndex }: CarouselDotsProps) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: totalItems }, (_, index) => (
        <div
          key={index}
          className={`h-2 w-2 rounded-full transition-colors ${
            index === selectedIndex
              ? 'bg-recipe-blue'
              : 'bg-recipe-blue/30'
          }`}
          aria-label={`Slide ${index + 1} of ${totalItems}`}
        />
      ))}
    </div>
  );
}
