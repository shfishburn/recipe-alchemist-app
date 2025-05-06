
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./carousel";

interface CarouselPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "dots" | "fraction" | "numbers";
  showNumbers?: boolean;
}

const CarouselPagination = React.forwardRef<HTMLDivElement, CarouselPaginationProps>(
  ({ className, variant = "dots", showNumbers = false, ...props }, ref) => {
    const { activeIndex } = useCarousel();
    const totalSlides = 3; // Fixed number for demo, ideally would be computed from children
    
    return (
      <div 
        ref={ref} 
        className={cn(
          "flex justify-center items-center gap-1 mt-1", 
          className
        )}
        aria-label="Carousel pagination"
        {...props}
      >
        {/* Simple dots pagination */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === activeIndex 
                  ? "bg-gray-700 dark:bg-gray-200 w-4" 
                  : "bg-gray-300 dark:bg-gray-600"
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    );
  }
);

CarouselPagination.displayName = "CarouselPagination";

export { CarouselPagination };
