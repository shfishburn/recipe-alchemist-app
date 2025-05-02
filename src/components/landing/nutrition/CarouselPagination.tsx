
import React from 'react';
import { CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface CarouselPaginationProps {
  totalItems: number;
  activeSlide: number;
  onSelectSlide: (index: number) => void;
}

export function CarouselPagination({ totalItems, activeSlide, onSelectSlide }: CarouselPaginationProps) {
  return (
    <div className="flex justify-center mt-6">
      <CarouselPrevious className="relative static transform-none mx-2" />
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              activeSlide === index ? "w-6 bg-recipe-purple" : "w-2 bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => onSelectSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <CarouselNext className="relative static transform-none mx-2" />
    </div>
  );
}
