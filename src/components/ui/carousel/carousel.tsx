
"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
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
  api: any;
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    
    // Detect number of items
    useEffect(() => {
      if (scrollContainerRef.current) {
        const items = scrollContainerRef.current.querySelectorAll('[aria-roledescription="slide"]');
        setTotalItems(items.length);
      }
    }, [children]);
    
    // Track scroll position to detect active slide
    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const handleScroll = () => {
        if (!container) return;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        const newIndex = Math.round(scrollLeft / containerWidth);
        
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
          setCanScrollPrev(newIndex > 0);
          setCanScrollNext(newIndex < totalItems - 1);
        }
      };
      
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }, [activeIndex, totalItems]);
    
    // Create a mock API object to support scrollSnapList
    const mockApi = {
      scrollSnapList: () => {
        return Array.from({ length: totalItems });
      },
      scrollTo: (index: number) => {
        if (!scrollContainerRef.current) return;
        const itemWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({ 
          left: itemWidth * index, 
          behavior: 'smooth' 
        });
      }
    };
    
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
          canScrollPrev,
          canScrollNext,
          activeIndex,
          api: mockApi,
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
              "scroll-smooth -mx-1 px-1 hw-accelerated momentum-scroll w-full",
              opts.align === "start" ? "snap-start" : 
              opts.align === "center" ? "snap-center" : 
              "snap-end"
            )}
            style={{ 
              touchAction: "pan-x", 
              scrollSnapType: "x mandatory",
              scrollPaddingInline: "0.25rem"
            }}
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

export { Carousel };
