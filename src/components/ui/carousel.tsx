"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarousel } from "@/hooks/use-carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBatteryStatus } from "@/hooks/use-battery-status";

export interface CarouselItem {
  id: string | number;
  content: any;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CarouselItem[];
  renderItem: (item: CarouselItem, index: number, isActive: boolean) => React.ReactNode;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  itemWidthMobile?: string;
  itemWidthDesktop?: string;
  onSlideChange?: (index: number) => void;
  initialSlide?: number;
  gap?: string;
  arrowPosition?: "inside" | "outside";
}

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
          {showArrows && items.length > 1 && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrevious}
                className={cn(
                  "carousel-nav-button absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm",
                  arrowPosition === "outside" ? "-left-10" : "left-2"
                )}
                aria-label="Previous slide"
                disabled={!items.length}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNext}
                className={cn(
                  "carousel-nav-button absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 shadow-sm",
                  arrowPosition === "outside" ? "-right-10" : "right-2"
                )}
                aria-label="Next slide"
                disabled={!items.length}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {/* Pagination dots */}
        {showDots && items.length > 1 && (
          <div className="carousel-pagination mt-4" role="tablist">
            {items.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "carousel-pagination-dot",
                  activeIndex === index ? "carousel-pagination-dot-active" : ""
                )}
                onClick={() => scrollToItem(index)}
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Go to slide ${index + 1}`}
                tabIndex={activeIndex === index ? 0 : -1}
              />
            ))}
          </div>
        )}
        
        {/* Slide counter text */}
        {showCounter && items.length > 1 && (
          <div className="text-center text-xs md:text-sm text-muted-foreground mt-1" aria-live="polite">
            Slide {activeIndex + 1} of {items.length}
          </div>
        )}
      </div>
    );
  }
);

Carousel.displayName = "Carousel";

export { Carousel };

// Export the CarouselItem type for use in other components
export type { CarouselItem };

// For backward compatibility - these are simplified versions of the original components
// that now use our new carousel implementation internally
export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} role="list" className={cn("draggable flex", className)} {...props} />
));
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="listitem"
    className={cn(
      "min-w-0 shrink-0 grow-0 basis-full",
      className
    )}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement, 
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn(
      "absolute top-1/2 -translate-y-1/2 left-4 h-8 w-8 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </Button>
));
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn(
      "absolute top-1/2 -translate-y-1/2 right-4 h-8 w-8 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </Button>
));
CarouselNext.displayName = "CarouselNext";

// Add the CarouselProgress component
export const CarouselProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn("relative h-1 w-full rounded-full bg-gray-200", className)} 
    {...props}
  >
    <div className="absolute h-full left-0 rounded-full bg-recipe-blue animate-carousel-progress" />
  </div>
));
CarouselProgress.displayName = "CarouselProgress";
