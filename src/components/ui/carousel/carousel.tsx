
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

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, opts = {} }, ref) => {
    // Simple scrolling implementation
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    
    // Track scroll position to detect active slide
    React.useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const handleScroll = () => {
        if (!container) return;
        const scrollLeft = container.scrollLeft;
        const itemWidth = container.offsetWidth;
        const newIndex = Math.round(scrollLeft / itemWidth);
        
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);
    
    // Placeholder functions to maintain API compatibility
    const scrollPrev = () => {
      if (!scrollContainerRef.current) return;
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ 
        left: -itemWidth, 
        behavior: 'smooth' 
      });
    };

    const scrollNext = () => {
      if (!scrollContainerRef.current) return;
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollBy({ 
        left: itemWidth, 
        behavior: 'smooth' 
      });
    };

    return (
      <CarouselContext.Provider
        value={{
          scrollPrev,
          scrollNext,
          canScrollPrev: activeIndex > 0, 
          canScrollNext: true,
          activeIndex,
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
              "flex overflow-x-auto scrollbar-hide snap-x snap-mandatory",
              "scroll-smooth -mx-2 px-2 pb-2 hw-accelerated momentum-scroll w-full",
              opts.align === "start" ? "snap-start" : 
              opts.align === "center" ? "snap-center" : 
              "snap-end"
            )}
            style={{ touchAction: "pan-x", scrollSnapType: "x mandatory" }}
            tabIndex={0}
            role="region"
            aria-label="Carousel content"
          >
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);

Carousel.displayName = "Carousel";

// Only export once - removing the duplicate export at the end
export { Carousel };
