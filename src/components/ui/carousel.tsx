
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
      pauseOnHover = true,
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
      scrollToItem,
      handleMouseEnter,
      handleMouseLeave
    } = useCarousel({
      itemCount: items.length,
      autoScroll: lowPowerMode ? false : autoScroll, // Disable auto-scroll in low power mode
      autoScrollInterval,
      itemWidthMobile,
      itemWidthDesktop,
      initialIndex: initialSlide,
      onSlideChange,
      pauseOnHover
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

    // Calculate carousel padding to allow space on sides for center alignment
    // Modified to ensure first position is never blank on web
    const sideSpacerStyle = React.useMemo(() => {
      // Only use spacers on mobile or when explicitly needed for specific layouts
      if (isMobile) {
        // Add a transparent pseudo-item at the beginning and end to allow center alignment
        const width = itemWidthMobile;
        // Convert percentage string to number (remove the %)
        const widthNum = parseFloat(width);
        
        // Calculate remaining space as percentage
        const spacerWidth = `${(100 - widthNum) / 2}%`;
        return { width: spacerWidth, minWidth: spacerWidth };
      } else {
        // For desktop, we don't want a blank first position, so we return a minimal spacer
        return { width: '4px', minWidth: '4px' };
      }
    }, [isMobile, itemWidthMobile, itemWidthDesktop]);

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
        <div 
          className="carousel-container relative w-full"
          onMouseEnter={pauseOnHover ? handleMouseEnter : undefined}
          onMouseLeave={pauseOnHover ? handleMouseLeave : undefined}
        >
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
            {/* Start spacer for center alignment - minimal on desktop */}
            <div className="carousel-spacer flex-shrink-0" style={sideSpacerStyle} aria-hidden="true" />
            
            {/* Actual carousel items */}
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "carousel-item",
                  activeIndex === index ? "active-carousel-item" : ""
                )}
                style={{ width: isMobile ? itemWidthMobile : itemWidthDesktop }}
                aria-hidden={activeIndex !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${items.length}`}
              >
                {renderItem(item, index, activeIndex === index)}
              </div>
            ))}
            
            {/* End spacer for center alignment - minimal on desktop */}
            <div className="carousel-spacer flex-shrink-0" style={sideSpacerStyle} aria-hidden="true" />
          </div>
          
          {/* Arrow navigation */}
          <CarouselNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            arrowPosition={arrowPosition}
            showArrows={showArrows}
            itemsCount={items.length}
          />
          
          {/* Progress indicator for auto-scrolling */}
          {autoScroll && !isMobile && !lowPowerMode && (
            <div 
              className={cn("carousel-progress-indicator", 
                autoScroll ? "animate" : ""
              )}
              style={{ 
                '--carousel-duration': `${autoScrollInterval}ms` 
              } as React.CSSProperties}
            />
          )}
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
  CarouselSlide,
  CarouselPrevious,
  CarouselNext,
  CarouselProgress
};
