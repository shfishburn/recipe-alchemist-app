
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "@/hooks/use-carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBatteryStatus } from "@/hooks/use-battery-status";
import { CarouselNavigation } from "./carousel/CarouselNavigation";
import { CarouselPagination } from "./carousel/CarouselPagination";
import { CarouselCounter } from "./carousel/CarouselCounter";
import { 
  CarouselContent,
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselProgress 
} from "./carousel/legacy-components";
import type { CarouselItem, CarouselProps } from "./carousel/types";

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      items,
      renderItem,
      className,
      autoScroll = false,
      autoScrollInterval = 5000,
      showArrows = true,
      showDots = true,
      showCounter = false,
      itemWidthMobile = "85%",
      itemWidthDesktop = "45%",
      onSlideChange,
      initialSlide = 0,
      gap = "gap-4",
      arrowPosition = "inside",
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const { lowPowerMode } = useBatteryStatus();
    
    // Use our custom carousel hook
    const {
      activeIndex,
      scrollRef,
      scrollToItem
    } = useCarousel({
      itemCount: items.length,
      autoScroll: lowPowerMode ? false : autoScroll, // Disable auto-scroll in low power mode
      autoScrollInterval,
      itemWidthMobile,
      itemWidthDesktop,
      initialIndex: initialSlide,
      onSlideChange
    });

    // Navigation buttons
    const handlePrevious = () => {
      const newIndex = (activeIndex - 1 + items.length) % items.length;
      scrollToItem(newIndex);
    };

    const handleNext = () => {
      const newIndex = (activeIndex + 1) % items.length;
      scrollToItem(newIndex);
    };

    return (
      <div 
        ref={ref}
        className={cn("w-full flex flex-col items-center", 
          arrowPosition === "outside" ? "px-10" : "", 
          className
        )} 
        {...props}
      >
        {/* Main carousel container */}
        <div className="carousel-container relative w-full">
          {/* Scrollable area */}
          <div 
            ref={scrollRef}
            className={cn("carousel-scroll-area", gap, 
              lowPowerMode ? "reduce-motion-mobile" : "",
              "hw-accelerated"
            )}
            tabIndex={0}
            aria-live="polite"
            aria-roledescription="carousel"
          >
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="carousel-item"
                style={{ width: isMobile ? itemWidthMobile : itemWidthDesktop }}
                aria-hidden={activeIndex !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${items.length}`}
              >
                {renderItem(item, index, activeIndex === index)}
              </div>
            ))}
          </div>
          
          {/* Arrow navigation */}
          <CarouselNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            arrowPosition={arrowPosition}
            showArrows={showArrows}
            itemsCount={items.length}
          />
        </div>
        
        {/* Pagination dots */}
        <CarouselPagination
          count={items.length}
          activeIndex={activeIndex}
          onClick={scrollToItem}
          showDots={showDots}
        />
        
        {/* Slide counter text */}
        <CarouselCounter
          current={activeIndex}
          total={items.length}
          showCounter={showCounter}
        />
      </div>
    );
  }
);

Carousel.displayName = "Carousel";

export { Carousel };

// Export the types
export type { CarouselItem, CarouselProps };

// Re-export legacy components for backward compatibility
export {
  CarouselContent,
  CarouselSlide as CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselProgress
};
