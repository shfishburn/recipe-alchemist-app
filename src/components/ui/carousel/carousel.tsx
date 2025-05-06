
"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

type CarouselProps = {
  className?: string;
  children?: React.ReactNode;
  opts?: {
    align?: "start" | "center" | "end";
    loop?: boolean;
    slidesPerView?: number;
    spaceBetween?: number;
    [key: string]: any;
  };
};

// Simple context to maintain API compatibility with existing code
type CarouselContextProps = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  activeIndex: number;
  api: null;
};

const CarouselContext = React.createContext<CarouselContextProps>({
  scrollPrev: () => {},
  scrollNext: () => {},
  canScrollPrev: false, 
  canScrollNext: false,
  activeIndex: 0,
  api: null,
});

export function useCarousel() {
  return React.useContext(CarouselContext);
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, opts = {} }, ref) => {
    // Simple scrolling implementation
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    
    // Placeholder functions to maintain API compatibility
    const scrollPrev = () => {
      if (!scrollContainerRef.current) return;
      scrollContainerRef.current.scrollBy({ 
        left: -300, 
        behavior: 'smooth' 
      });
    };

    const scrollNext = () => {
      if (!scrollContainerRef.current) return;
      scrollContainerRef.current.scrollBy({ 
        left: 300, 
        behavior: 'smooth' 
      });
    };

    return (
      <CarouselContext.Provider
        value={{
          scrollPrev,
          scrollNext,
          canScrollPrev: true, 
          canScrollNext: true,
          activeIndex: 0,
          api: null,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden",
            className
          )}
          aria-roledescription="carousel"
        >
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x",
              "scroll-smooth -mx-4 px-4 pb-4 hw-accelerated momentum-scroll",
              opts.align === "start" ? "snap-start" : 
              opts.align === "center" ? "snap-center" : 
              "snap-end"
            )}
          >
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";
