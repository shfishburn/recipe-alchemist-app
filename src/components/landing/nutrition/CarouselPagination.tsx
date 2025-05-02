
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CarouselPaginationProps {
  totalItems: number;
  activeSlide: number;
  onSelectSlide: (index: number) => void;
}

export function CarouselPagination({ totalItems, activeSlide, onSelectSlide }: CarouselPaginationProps) {
  const handlePrevious = () => {
    onSelectSlide((activeSlide - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    onSelectSlide((activeSlide + 1) % totalItems);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      {/* Navigation buttons and dots */}
      <div className="flex justify-center items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-recipe-purple hover:text-white hover:border-transparent"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
        
        <div className="flex gap-2 items-center">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              className={`transition-all focus:outline-none ${
                activeSlide === index 
                  ? "w-6 h-2.5 bg-recipe-purple rounded-full" 
                  : "w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-recipe-purple/50"
              }`}
              onClick={() => onSelectSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : "false"}
            />
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full border-gray-300 dark:border-gray-600 hover:bg-recipe-purple hover:text-white hover:border-transparent"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
      
      {/* Caption text for current slide */}
      <p className="text-xs text-muted-foreground mt-1">
        <span className="font-medium text-recipe-purple">{activeSlide + 1}</span> of {totalItems} nutrition plans
      </p>
    </div>
  );
}
